import { dbGet, dbAll, dbRun } from '../db/init.js';
import bcrypt from 'bcryptjs';

export const getUsers = async (req, res) => {
  try {
    const users = await dbAll('SELECT id, email, name, role, createdAt FROM users ORDER BY createdAt DESC');
    res.status(200).json({ data: users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createUser = async (req, res) => {
  const { email, password, name, role } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  try {
    const existing = await dbGet('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    await dbRun(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, name || '', role || 'editor']
    );
    
    res.status(201).json({ success: true, message: 'User created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, password, name, role } = req.body;
  
  try {
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await dbRun(
        'UPDATE users SET email = ?, password = ?, name = ?, role = ? WHERE id = ?',
        [email, hashedPassword, name, role, id]
      );
    } else {
      await dbRun(
        'UPDATE users SET email = ?, name = ?, role = ? WHERE id = ?',
        [email, name, role, id]
      );
    }
    res.status(200).json({ success: true, message: 'User updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    // Prevent deleting the last superadmin
    const superadmins = await dbAll("SELECT id FROM users WHERE role = 'superadmin'");
    if (superadmins.length === 1 && superadmins[0].id == id) {
      return res.status(400).json({ error: 'Cannot delete the last superadmin' });
    }
    
    await dbRun('DELETE FROM users WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
