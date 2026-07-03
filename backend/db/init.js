import initSqlJs from 'sql.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(__dirname, 'awi.db');

class SqlJsDatabase {
  constructor(SQL, dbPath) {
    this.SQL = SQL;
    this.dbPath = dbPath;
    if (fs.existsSync(dbPath)) {
      try {
        const filebuffer = fs.readFileSync(dbPath);
        this.db = new SQL.Database(filebuffer);
        console.log('Connected to the SQLite (WASM) database.');
      } catch (err) {
        console.warn('Could not read binary SQLite file, starting fresh in-memory:', err.message);
        this.db = new SQL.Database();
      }
    } else {
      console.log('No existing DB found, creating a new SQLite (WASM) database.');
      this.db = new SQL.Database();
    }
  }

  save() {
    try {
      const data = this.db.export();
      fs.writeFileSync(this.dbPath, Buffer.from(data));
    } catch (err) {
      console.error('Failed to save SQLite file to disk:', err);
    }
  }

  all(query, params = []) {
    try {
      const stmt = this.db.prepare(query);
      stmt.bind(params);
      const rows = [];
      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }
      stmt.free();
      return rows;
    } catch (err) {
      throw err;
    }
  }

  get(query, params = []) {
    try {
      const stmt = this.db.prepare(query);
      stmt.bind(params);
      let row = null;
      if (stmt.step()) {
        row = stmt.getAsObject();
      }
      stmt.free();
      return row;
    } catch (err) {
      throw err;
    }
  }

  run(query, params = []) {
    try {
      const stmt = this.db.prepare(query);
      stmt.run(params);
      stmt.free();
      this.save(); // Persist changes immediately to the binary db file
    } catch (err) {
      throw err;
    }
  }

  close() {
    this.save();
    try {
      this.db.close();
      console.log('Database connection closed.');
    } catch (err) {
      console.error('Error closing db:', err);
    }
  }
}

// Global DB instance placeholder
let dbInstance = null;

// Initialize database
export const initDB = async () => {
  if (dbInstance) return dbInstance;
  try {
    const SQL = await initSqlJs();
    dbInstance = new SqlJsDatabase(SQL, DB_PATH);
    await initializeTables();
    return dbInstance;
  } catch (err) {
    console.error("Failed to initialize WebAssembly SQLite driver:", err);
    throw err;
  }
};

const initializeTables = async () => {
  console.log('Initializing database tables...');
  
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      role TEXT NOT NULL DEFAULT 'editor',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS sessions (
      sessionId TEXT PRIMARY KEY,
      startedAt TEXT,
      lastHeartbeat TEXT,
      duration INTEGER,
      pageviews INTEGER,
      browser TEXT,
      os TEXT,
      country TEXT,
      countryCode TEXT,
      referrer TEXT,
      currentPage TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      sessionId TEXT,
      timestamp TEXT,
      eventName TEXT,
      path TEXT,
      country TEXT,
      browser TEXT,
      os TEXT,
      eventData TEXT,
      FOREIGN KEY (sessionId) REFERENCES sessions (sessionId)
    )`,
    `CREATE TABLE IF NOT EXISTS publications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT,
      author TEXT,
      status TEXT DEFAULT 'draft',
      date TEXT,
      available BOOLEAN DEFAULT 0,
      downloadUrl TEXT,
      downloads INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS enforcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      country TEXT,
      date TEXT,
      status TEXT DEFAULT 'active',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS awpii_scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      country TEXT UNIQUE NOT NULL,
      score REAL NOT NULL,
      details TEXT,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS tracker_status (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      country TEXT UNIQUE NOT NULL,
      status TEXT NOT NULL,
      details TEXT,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    )`
  ];

  for (const query of tables) {
    dbInstance.run(query);
  }

  // Safely attempt to add new columns to publications table if it already existed
  const addColumns = [
    `ALTER TABLE publications ADD COLUMN category TEXT;`,
    `ALTER TABLE publications ADD COLUMN description TEXT;`,
    `ALTER TABLE publications ADD COLUMN date TEXT;`,
    `ALTER TABLE publications ADD COLUMN available BOOLEAN DEFAULT 0;`,
    `ALTER TABLE publications ADD COLUMN downloadUrl TEXT;`,
    `ALTER TABLE publications ADD COLUMN downloads INTEGER DEFAULT 0;`
  ];
  
  for (const alterQuery of addColumns) {
    try {
      dbInstance.run(alterQuery);
    } catch (e) {
      // Column likely already exists, ignore
    }
  }

  // Seed default Superadmin user
  const defaultEmail = 'admin@africaweb3institute.org';
  const defaultPassword = 'admin'; // For MVP purposes

  try {
    const existingUser = dbInstance.get('SELECT * FROM users WHERE email = ?', [defaultEmail]);
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      dbInstance.run(
        'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
        [defaultEmail, hashedPassword, 'Superadmin', 'superadmin']
      );
      console.log(`✅ Seeded default superadmin: ${defaultEmail} / ${defaultPassword}`);
    } else {
      console.log('✅ Default superadmin already exists.');
    }
  } catch (err) {
    console.error('Error seeding default user:', err.message);
  }
};

// Promisified DB helpers (so they match the async/await signature of our previous controllers)
export const dbRun = async (query, params = []) => {
  if (!dbInstance) await initDB();
  return dbInstance.run(query, params);
};

export const dbGet = async (query, params = []) => {
  if (!dbInstance) await initDB();
  return dbInstance.get(query, params);
};

export const dbAll = async (query, params = []) => {
  if (!dbInstance) await initDB();
  return dbInstance.all(query, params);
};

// If run directly, just initialize
const isMain = process.argv[1] === __filename;
if (isMain) {
  initDB().then(() => {
    console.log('✅ Database initialization complete.');
    process.exit(0);
  });
}
