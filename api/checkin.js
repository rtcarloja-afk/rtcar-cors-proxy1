export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const gasUrl = 'https://script.google.com/macros/s/AKfycbxXO-33LKf8Kpq30KsoisyR1g1PQWUSa8lgrUmC7gvCL-8fExyb3i54JhusHgRf_gIF7w/exec';
    const action = req.query.action || 'test';
    const codigo = req.query.codigo || '';

    const response = await fetch(`${gasUrl}?action=${action}&codigo=${codigo}`);
    const data = await response.json();
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
