// controllers/schoolController.js
const db = require('../db/config');

/**
 * Haversine formula to compute distance (km) between two lat/lon points
 */
const getDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = v => (v * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/**
 * POST /addSchool
 */
const addSchool = async (req, res) => {
  const { name = '', address = '', latitude, longitude } = req.body;

  // Basic presence & trim
  const n = name.trim(), a = address.trim();
  if (!n || !a || latitude == null || longitude == null)
    return res.status(400).json({ error: 'All fields are required.' });

  // Length limits
  if (n.length > 100 || a.length > 255)
    return res.status(400).json({ error: 'Name/address too long.' });

  const lat = parseFloat(latitude), lon = parseFloat(longitude);
  if (isNaN(lat) || isNaN(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180)
    return res.status(400).json({ error: 'Coordinates invalid.' });

  try {
    await db.execute(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [n, a, lat, lon]
    );
    res.status(201).json({ message: 'School added.' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error.' });
  }
};

/**
 * GET /listSchools?latitude=..&longitude=..
 */
const listSchools = async (req, res) => {
  const { latitude, longitude } = req.query;
  const userLat = parseFloat(latitude), userLon = parseFloat(longitude);

  if (isNaN(userLat) || isNaN(userLon))
    return res.status(400).json({ error: 'Valid lat & lon required.' });

  try {
    const [rows] = await db.execute('SELECT * FROM schools');
    const data = rows.map(school => {
      const dist = getDistance(userLat, userLon, school.latitude, school.longitude);
      return { ...school, distance: Number(dist.toFixed(2)) };
    });
    data.sort((a, b) => a.distance - b.distance);
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = { addSchool, listSchools };
