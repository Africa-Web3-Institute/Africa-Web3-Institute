import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './db/init.js';

// Routes
import analyticsRoutes from './routes/analytics.js';
import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js';
import usersRoutes from './routes/users.js';
import settingsRoutes from './routes/settings.js';
import contactRoutes from './routes/contact.js';
import visualizationRoutes from './routes/visualization.js';
import newsletterRoutes from './routes/newsletter.js';
import stateOfWeb3Routes from './routes/stateOfWeb3.js';
import researchMetricsRoutes from './routes/researchMetrics.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Global Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api', analyticsRoutes); // Handles /api/event, /api/live, /api/export
app.use('/api/admin', authRoutes); // Handles /api/admin/login
app.use('/api/admin/users', usersRoutes);
app.use('/api/admin/settings', settingsRoutes);
app.use('/api', contactRoutes); // Handles /api/contact, /api/contact-messages
app.use('/api/visualizations', visualizationRoutes); // Week 4: Research Visualization Systems
app.use('/api/newsletter', newsletterRoutes); // Week 5: Newsletter Intelligence & Tracking
app.use('/api/state-of-web3', stateOfWeb3Routes); // Week 6: State of Web3 in Africa Dashboard
app.use('/api/research-metrics', researchMetricsRoutes); // Week 7: Research Repository Metrics
app.use('/api', researchMetricsRoutes); // Handles /api/publications/:id/download
app.use('/api', contentRoutes); // Handles /api/publications, /api/enforcement, /api/awpii, /api/tracker

// Start server after DB initialization
export const startServer = async () => {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log('=================================================');
      console.log(`📡 Africa Web Institute API Server Running`);
      console.log(`🔌 Listening on port ${PORT}`);
      console.log(`💾 DB Engine: sql.js (WebAssembly SQLite)`);
      console.log('=================================================');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

export { app };

import { fileURLToPath } from 'url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  startServer();
}


