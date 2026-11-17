import initSqlJs from 'sql.js';
import { dirname, join, resolve, sep } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import { seedDatabaseData } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// The database file that ships with the repo
const BUNDLED_DB_PATH = join(__dirname, 'awi.db');

// Where the live database is kept. A container's own disk is wiped on every deploy, so
// on Railway the file must live on the attached volume. Railway tells us where that is
// (RAILWAY_VOLUME_MOUNT_PATH); a DB_PATH pointing anywhere else would silently lose all
// accounts, content and activity on the next deploy, so it is overridden.
const VOLUME_DIR = process.env.RAILWAY_VOLUME_MOUNT_PATH || '';
const ON_RAILWAY = !!(process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_ENVIRONMENT_NAME || process.env.RAILWAY_PROJECT_ID);
const isInside = (file, dir) => resolve(file).startsWith(resolve(dir) + sep);

const resolveDbPath = () => {
  const explicit = process.env.DB_PATH;
  if (VOLUME_DIR) {
    if (explicit && isInside(explicit, VOLUME_DIR)) return explicit;
    if (explicit) console.warn(`⚠️  DB_PATH (${explicit}) is not on the attached volume (${VOLUME_DIR}). Using the volume instead so data survives deploys.`);
    return join(VOLUME_DIR, 'awi.db');
  }
  return explicit || BUNDLED_DB_PATH;
};
const DB_PATH = resolveDbPath();

// Shown to superadmins on the dashboard
export const DB_STATUS = {
  path: DB_PATH,
  volume: VOLUME_DIR || null,
  onRailway: ON_RAILWAY,
  persistent: ON_RAILWAY ? !!VOLUME_DIR && isInside(DB_PATH, VOLUME_DIR) : true,
};
if (ON_RAILWAY && !DB_STATUS.persistent) {
  console.error('🚨 NO PERSISTENT VOLUME: accounts, content and the activity log will be WIPED on every deploy. Attach a volume to this service in Railway.');
}

// First start on an empty volume: copy the bundled database so the site starts
// with its existing content instead of an empty one.
if (DB_PATH !== BUNDLED_DB_PATH && !fs.existsSync(DB_PATH)) {
  try {
    fs.mkdirSync(dirname(DB_PATH), { recursive: true });
    if (fs.existsSync(BUNDLED_DB_PATH)) {
      fs.copyFileSync(BUNDLED_DB_PATH, DB_PATH);
      console.log(`📦 Copied bundled database to ${DB_PATH}`);
    }
  } catch (err) {
    console.error(`Could not prepare database at ${DB_PATH}:`, err.message);
  }
}
console.log(`💾 Database file: ${DB_PATH}`);

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
    // Sample content is added to a brand-new database only, once. (Running the seeder on every
    // start re-added sample items people had deleted.)
    const seeded = dbInstance.get("SELECT value FROM settings WHERE key = 'sampleDataSeeded'");
    if (!seeded) {
      const hasContent = (dbInstance.get('SELECT COUNT(*) AS n FROM publications')?.n || 0) > 0;
      if (!hasContent) await seedDatabaseData(dbInstance);
      dbInstance.run("INSERT INTO settings (key, value) VALUES ('sampleDataSeeded', '1')");
    }
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
    `CREATE TABLE IF NOT EXISTS activity_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      userEmail TEXT,
      userName TEXT,
      action TEXT NOT NULL,
      entityType TEXT,
      entityId TEXT,
      summary TEXT,
      ip TEXT,
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
      status TEXT DEFAULT "published",
      date TEXT,
      available BOOLEAN DEFAULT 0,
      downloadUrl TEXT,
      downloads INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS blogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      excerpt TEXT,
      content TEXT NOT NULL,
      category TEXT NOT NULL,
      author TEXT NOT NULL,
      authorRole TEXT,
      coverImage TEXT,
      tags TEXT,
      readTime TEXT DEFAULT "5 min read",
      publishedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      isPublished BOOLEAN DEFAULT 1,
      featured BOOLEAN DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE,
      excerpt TEXT,
      content TEXT,
      category TEXT NOT NULL,
      type TEXT DEFAULT "article",
      author TEXT NOT NULL,
      authorRole TEXT,
      date TEXT,
      readTime TEXT DEFAULT "4 min read",
      image TEXT,
      downloadUrl TEXT,
      available BOOLEAN DEFAULT 1,
      featured BOOLEAN DEFAULT 0,
      status TEXT DEFAULT "published",
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      status TEXT DEFAULT "active",
      source TEXT DEFAULT "website",
      subscribedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS newsletters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      edition INTEGER,
      date TEXT NOT NULL,
      description TEXT,
      content TEXT,
      readTime TEXT DEFAULT "4 min read",
      url TEXT,
      status TEXT DEFAULT "sent",
      sentAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
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
    )`,
    `CREATE TABLE IF NOT EXISTS visualizations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      category TEXT,
      type TEXT NOT NULL,
      description TEXT,
      config TEXT,
      data TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      segment TEXT DEFAULT 'general',
      status TEXT DEFAULT 'active',
      subscribedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      lastEngagedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS newsletter_campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subject TEXT NOT NULL,
      segment TEXT DEFAULT 'all',
      sentAt DATETIME,
      totalSent INTEGER DEFAULT 0,
      opens INTEGER DEFAULT 0,
      clicks INTEGER DEFAULT 0,
      status TEXT DEFAULT 'draft',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS newsletter_opens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      campaignId INTEGER,
      subscriberId INTEGER,
      openedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      userAgent TEXT,
      ip TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS newsletter_clicks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      campaignId INTEGER,
      subscriberId INTEGER,
      targetUrl TEXT,
      clickedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      userAgent TEXT,
      ip TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS ecosystem_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      indicator TEXT NOT NULL,
      value REAL NOT NULL,
      unit TEXT,
      country TEXT,
      year INTEGER,
      growthRate REAL,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS web3_startups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      country TEXT NOT NULL,
      category TEXT NOT NULL,
      fundingStage TEXT,
      fundingTotalUsd REAL,
      foundedYear INTEGER,
      description TEXT,
      website TEXT,
      activeUsers INTEGER,
      metricsJson TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS citations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      publicationId INTEGER NOT NULL,
      citationSource TEXT NOT NULL,
      sourceType TEXT DEFAULT 'academic',
      citationDate TEXT,
      citationUrl TEXT,
      quote TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS research_downloads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      publicationId INTEGER NOT NULL,
      sessionId TEXT,
      userCountry TEXT,
      downloadedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      organization TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'unread',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
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
    `ALTER TABLE publications ADD COLUMN downloads INTEGER DEFAULT 0;`,
    // Per-account permission overrides, enabled/disabled flag and last sign-in
    `ALTER TABLE users ADD COLUMN permissions TEXT;`,
    `ALTER TABLE users ADD COLUMN active INTEGER DEFAULT 1;`,
    `ALTER TABLE users ADD COLUMN lastLoginAt DATETIME;`,
    // Sessions issued before this time are rejected (set whenever a password changes)
    `ALTER TABLE users ADD COLUMN passwordChangedAt DATETIME;`
  ];
  
  for (const alterQuery of addColumns) {
    try {
      dbInstance.run(alterQuery);
    } catch (e) {
      // Column likely already exists, ignore
    }
  }

  await ensureAdminAccess();
};

// Passwords that must never be accepted (the old built-in default and friends)
export const WEAK_PASSWORDS = ['admin', 'password', 'admin123', 'changeme', '12345678', '1234567890'];
export const isWeakPassword = (pw) => WEAK_PASSWORDS.includes(String(pw || '').trim().toLowerCase());

// There is no built-in admin/admin any more. The first superadmin (or a replacement, if
// nobody can manage accounts) comes from SUPERADMIN_EMAIL + SUPERADMIN_PASSWORD set in the
// hosting environment. They only act when there is no usable superadmin, so leaving them
// set by mistake can't reset anyone's password; remove them once you can sign in.
const ensureAdminAccess = async () => {
  const recoveryEmail = (process.env.SUPERADMIN_EMAIL || '').trim().toLowerCase();
  const recoveryPassword = process.env.SUPERADMIN_PASSWORD || '';
  try {
    const supers = dbInstance.all("SELECT id, email, password FROM users WHERE role = 'superadmin' AND COALESCE(active, 1) != 0");
    const usable = supers.filter((u) => !WEAK_PASSWORDS.some((w) => bcrypt.compareSync(w, u.password)));
    const userCount = dbInstance.get('SELECT COUNT(*) AS n FROM users')?.n || 0;

    if (usable.length > 0) {
      console.log(`✅ ${userCount} admin account(s); ${usable.length} active superadmin(s).`);
      if (recoveryEmail || recoveryPassword) {
        console.warn('⚠️  SUPERADMIN_EMAIL / SUPERADMIN_PASSWORD are set but were ignored (a superadmin already exists). Remove them from the hosting variables.');
      }
      return;
    }

    if (!recoveryEmail) {
      console.error('🚨 No usable superadmin account. Set SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD (12+ characters) in the hosting variables and restart.');
      return;
    }
    if (recoveryPassword.length < 12 || isWeakPassword(recoveryPassword)) {
      console.error('🚨 SUPERADMIN_PASSWORD must be at least 12 characters and not a common password. No changes made.');
      return;
    }

    const hash = await bcrypt.hash(recoveryPassword, 12);
    const existing = dbInstance.get('SELECT id FROM users WHERE LOWER(email) = ?', [recoveryEmail]);
    if (existing) {
      dbInstance.run("UPDATE users SET role = 'superadmin', active = 1, permissions = '{}', password = ?, passwordChangedAt = CURRENT_TIMESTAMP WHERE id = ?", [hash, existing.id]);
    } else {
      dbInstance.run(
        "INSERT INTO users (email, password, name, role, permissions, active, passwordChangedAt) VALUES (?, ?, '', 'superadmin', '{}', 1, CURRENT_TIMESTAMP)",
        [recoveryEmail, hash]
      );
    }
    dbInstance.run(
      "INSERT INTO activity_log (action, entityType, summary) VALUES ('update', 'User account', ?)",
      [`${recoveryEmail} — made superadmin from the server's SUPERADMIN_EMAIL setting`]
    );
    console.log(`🔑 ${recoveryEmail} is now the superadmin. Remove SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD from the hosting variables.`);
  } catch (err) {
    console.error('Admin access check failed:', err.message);
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
