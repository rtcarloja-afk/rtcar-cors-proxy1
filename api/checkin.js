module.exports = async (req, res) => {
  // Configurações de CORS para permitir requisições do seu frontend
  res.setHeader('Access-Control-Allow-Origin', '*'); // Mudei para * para teste
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Se for uma requisição OPTIONS (preflight), responda imediatamente
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // URL do seu Google Apps Script
  const gasUrl = 'https://script.google.com/macros/s/AKfycbxXO-33LKf8Kpq30KsoisyR1g1PQWUSa8lgrUmC7gvCL-8fExyb3i54JhusHgRf_gIF7w/exec';

  try {
    const action = req.query.action;
    
    const targetGasUrl = new URL(gasUrl);
    if (action) {
      targetGasUrl.searchParams.append('action', action);
    }
    
    for (const key in req.query) {
      if (key !== 'action') {
        targetGasUrl.searchParams.append(key, req.query[key]);
      }
    }

    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    if (req.method === 'POST') {
      fetchOptions.body = JSON.stringify(req.body);
    }

    console.log('Vercel Function Log:');
    console.log('  Incoming Method:', req.method);
    console.log('  Forwarding to GAS URL:', targetGasUrl.toString());

    const gasResponse = await fetch(targetGasUrl.toString(), fetchOptions);
    const gasData = await gasResponse.json();
    
    res.status(gasResponse.status).json(gasData);
  } catch (error) {
    console.error('Vercel Function Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno no proxy Vercel: ' + error.message
    });
  }
};
