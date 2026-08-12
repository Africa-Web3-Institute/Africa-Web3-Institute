import { dbGet, dbAll, dbRun } from '../db/init.js';

// Track publication download and return download link
export const trackDownload = async (req, res) => {
  const { id } = req.params;
  const { sessionId, country } = req.query;

  try {
    const publication = await dbGet('SELECT * FROM publications WHERE id = ?', [id]);
    if (!publication) {
      return res.status(404).json({ error: 'Publication not found' });
    }

    // Record download event log
    await dbRun(
      'INSERT INTO research_downloads (publicationId, sessionId, userCountry) VALUES (?, ?, ?)',
      [publication.id, sessionId || 'anonymous', country || 'Unknown']
    );

    // Increment publication download counter
    await dbRun(
      'UPDATE publications SET downloads = downloads + 1, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [publication.id]
    );

    const updatedPub = await dbGet('SELECT downloads FROM publications WHERE id = ?', [publication.id]);

    res.status(200).json({
      success: true,
      message: 'Download tracked successfully',
      publicationId: publication.id,
      title: publication.title,
      totalDownloads: updatedPub ? updatedPub.downloads : publication.downloads + 1,
      downloadUrl: publication.downloadUrl || `/downloads/report-${publication.id}.pdf`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get citations list (with optional publicationId filter)
export const getCitations = async (req, res) => {
  const { publicationId } = req.query;

  try {
    let query = 'SELECT * FROM citations';
    const params = [];

    if (publicationId) {
      query += ' WHERE publicationId = ?';
      params.push(publicationId);
    }

    query += ' ORDER BY createdAt DESC';

    const citations = await dbAll(query, params);
    res.status(200).json({ data: citations, count: citations.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add new citation reference
export const addCitation = async (req, res) => {
  const { publicationId, citationSource, sourceType, citationDate, citationUrl, quote } = req.body;

  if (!publicationId || !citationSource) {
    return res.status(400).json({ error: 'Publication ID and citation source are required.' });
  }

  try {
    await dbRun(
      'INSERT INTO citations (publicationId, citationSource, sourceType, citationDate, citationUrl, quote) VALUES (?, ?, ?, ?, ?, ?)',
      [publicationId, citationSource, sourceType || 'academic', citationDate || new Date().toISOString().split('T')[0], citationUrl || '', quote || '']
    );

    res.status(201).json({ success: true, message: 'Citation record added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete citation reference
export const deleteCitation = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await dbGet('SELECT * FROM citations WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ error: 'Citation reference not found' });

    await dbRun('DELETE FROM citations WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: 'Citation reference deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Research Impact Dashboard & Automated Report Generation
export const getResearchImpactDashboard = async (req, res) => {
  try {
    const publications = await dbAll('SELECT * FROM publications');
    const citations = await dbAll('SELECT * FROM citations');
    const downloads = await dbAll('SELECT * FROM research_downloads');

    let totalDownloads = 0;
    publications.forEach(p => { totalDownloads += p.downloads || 0; });

    // Calculate publication impact & engagement scores
    const impactByPublication = publications.map(pub => {
      const pubCitations = citations.filter(c => c.publicationId === pub.id);
      const pubDownloads = downloads.filter(d => d.publicationId === pub.id);
      const downloadCount = Math.max(pub.downloads || 0, pubDownloads.length);

      // Engagement Score Formula: (downloads * 1.5) + (citations * 10)
      const engagementScore = Math.round((downloadCount * 1.5) + (pubCitations.length * 10));

      return {
        id: pub.id,
        title: pub.title,
        category: pub.category,
        downloads: downloadCount,
        citationCount: pubCitations.length,
        engagementScore,
        citations: pubCitations
      };
    });

    impactByPublication.sort((a, b) => b.engagementScore - a.engagementScore);

    const automatedReportSummary = `
# Africa Web3 Institute - Research Impact Report
**Generated at:** ${new Date().toISOString()}

## Key Performance Indicators
- **Total Research Publications:** ${publications.length}
- **Total Report Downloads:** ${totalDownloads}
- **Verified Policy & Academic Citations:** ${citations.length}
- **Top Performing Research Paper:** "${impactByPublication[0] ? impactByPublication[0].title : 'N/A'}" (Score: ${impactByPublication[0] ? impactByPublication[0].engagementScore : 0})

## Automated Reporting Status
- **Reporting Automation:** ACTIVE
- **Telemetry & Impact Pipeline:** OPERATIONAL
    `.trim();

    res.status(200).json({
      impactDashboard: {
        reportingAutomationActive: true,
        totalPublications: publications.length,
        totalDownloads,
        totalCitations: citations.length,
        publicationsImpact: impactByPublication,
        automatedReportSummary
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
