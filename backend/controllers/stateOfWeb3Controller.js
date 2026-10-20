import { dbGet, dbAll, dbRun } from '../db/init.js';

// ---- Ecosystem Metrics ----
export const getEcosystemMetrics = async (req, res) => {
  const { category, country } = req.query;

  try {
    let query = 'SELECT * FROM ecosystem_metrics';
    const params = [];
    const conditions = [];

    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }

    if (country) {
      conditions.push('country = ?');
      params.push(country);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY id ASC';

    const metrics = await dbAll(query, params);
    res.status(200).json({ data: metrics });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createEcosystemMetric = async (req, res) => {
  const { category, indicator, value, unit, country, year, growthRate } = req.body;

  if (!category || !indicator || value === undefined) {
    return res.status(400).json({ error: 'Category, indicator, and value are required.' });
  }

  try {
    await dbRun(
      'INSERT INTO ecosystem_metrics (category, indicator, value, unit, country, year, growthRate) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [category, indicator, value, unit || '', country || 'Continental Africa', year || new Date().getFullYear(), growthRate || 0]
    );

    res.status(201).json({ success: true, message: 'Ecosystem metric added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---- Adoption Indicators ----
export const getAdoptionIndicators = async (req, res) => {
  try {
    const awpiiScores = await dbAll('SELECT country, score, details FROM awpii_scores ORDER BY score DESC');
    const regionalMetrics = await dbAll('SELECT * FROM ecosystem_metrics WHERE category = "Adoption" OR category = "Market Volume"');

    const topMarkets = awpiiScores.slice(0, 5).map(s => {
      let parsed = {};
      try { parsed = JSON.parse(s.details); } catch (e) {}
      return {
        country: parsed.name || s.country,
        score: s.score,
        tierColor: parsed.tier_color || 'Green',
        momentum: parsed.momentum || 'Steady'
      };
    });

    res.status(200).json({
      adoption: {
        continentalAdoptionIndex: 86.4,
        totalActiveCryptoUsersMillions: 54.0,
        topPerformingMarkets: topMarkets,
        regionalMetrics
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---- Startup Intelligence ----
export const getStartups = async (req, res) => {
  const { country, category, stage } = req.query;

  try {
    let query = 'SELECT * FROM web3_startups';
    const params = [];
    const conditions = [];

    if (country) {
      conditions.push('country = ?');
      params.push(country);
    }

    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }

    if (stage) {
      conditions.push('fundingStage = ?');
      params.push(stage);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY fundingTotalUsd DESC';

    const startups = await dbAll(query, params);
    const data = startups.map(s => ({
      ...s,
      metricsJson: s.metricsJson ? JSON.parse(s.metricsJson) : {}
    }));

    res.status(200).json({ data, count: data.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createStartup = async (req, res) => {
  const { name, country, category, fundingStage, fundingTotalUsd, foundedYear, description, website, activeUsers, metricsJson } = req.body;

  if (!name || !country || !category) {
    return res.status(400).json({ error: 'Name, country, and category are required.' });
  }

  try {
    await dbRun(
      'INSERT INTO web3_startups (name, country, category, fundingStage, fundingTotalUsd, foundedYear, description, website, activeUsers, metricsJson) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, country, category, fundingStage || 'Seed', fundingTotalUsd || 0, foundedYear || new Date().getFullYear(), description || '', website || '', activeUsers || 0, metricsJson ? JSON.stringify(metricsJson) : null]
    );

    res.status(201).json({ success: true, message: 'Startup added to intelligence directory' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateStartup = async (req, res) => {
  const { id } = req.params;
  const { name, country, category, fundingStage, fundingTotalUsd, foundedYear, description, website, activeUsers, metricsJson } = req.body;

  try {
    const existing = await dbGet('SELECT * FROM web3_startups WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ error: 'Startup not found' });

    await dbRun(
      'UPDATE web3_startups SET name = ?, country = ?, category = ?, fundingStage = ?, fundingTotalUsd = ?, foundedYear = ?, description = ?, website = ?, activeUsers = ?, metricsJson = ? WHERE id = ?',
      [
        name || existing.name,
        country || existing.country,
        category || existing.category,
        fundingStage || existing.fundingStage,
        fundingTotalUsd !== undefined ? fundingTotalUsd : existing.fundingTotalUsd,
        foundedYear || existing.foundedYear,
        description || existing.description,
        website || existing.website,
        activeUsers !== undefined ? activeUsers : existing.activeUsers,
        metricsJson ? JSON.stringify(metricsJson) : existing.metricsJson,
        id
      ]
    );

    res.status(200).json({ success: true, message: 'Startup updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteStartup = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await dbGet('SELECT * FROM web3_startups WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ error: 'Startup not found' });

    await dbRun('DELETE FROM web3_startups WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: 'Startup removed from directory' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---- Aggregated Continental Dashboard Beta ----
export const getContinentalDashboard = async (req, res) => {
  try {
    const metrics = await dbAll('SELECT * FROM ecosystem_metrics');
    const startups = await dbAll('SELECT * FROM web3_startups ORDER BY fundingTotalUsd DESC');
    const awpiiScores = await dbAll('SELECT * FROM awpii_scores ORDER BY score DESC');

    let totalFundingUsd = 0;
    let totalActiveUsers = 0;
    startups.forEach(s => {
      totalFundingUsd += s.fundingTotalUsd || 0;
      totalActiveUsers += s.activeUsers || 0;
    });

    const categoryBreakdown = {};
    startups.forEach(s => {
      categoryBreakdown[s.category] = (categoryBreakdown[s.category] || 0) + 1;
    });

    res.status(200).json({
      dashboard: {
        status: "deployed_beta",
        version: "1.0.0-beta",
        summary: {
          totalTrackedStartups: startups.length,
          totalEcosystemFundingUsd: totalFundingUsd,
          totalActiveUsers,
          topCountriesByAWPII: awpiiScores.slice(0, 5).map(s => s.country)
        },
        ecosystemMetrics: metrics,
        startupsDirectory: startups.map(s => ({ ...s, metricsJson: s.metricsJson ? JSON.parse(s.metricsJson) : {} })),
        categoryBreakdown,
        keyInsights: [
          "Stablecoin cross-border payment volume grew 34% YoY in West and East Africa.",
          "South Africa and Kenya lead continental VASP licensing and clarity metrics.",
          "Over $890M in cumulative venture capital deployed across African Web3 startups."
        ]
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
