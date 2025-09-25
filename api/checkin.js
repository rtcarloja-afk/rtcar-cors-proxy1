export default async function handler(req, res) {
  // Configurações de CORS para permitir requisições do seu frontend
  res.setHeader('Access-Control-Allow-Origin', 'https://rtcar-checkin-aniversario-2025.web.app'); // Use a URL específica do seu frontend
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400'); // Cachea as informações de preflight por 24h

  // Se for uma requisição OPTIONS (preflight), responda imediatamente
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // URL do seu Google Apps Script
  const gasUrl = 'https://script.google.com/macros/s/AKfycbxXO-33LKf8Kpq30KsoisyR1g1PQWUSa8lgrUmC7gvCL-8fExyb3i54JhusHgRf_gIF7w/exec';

  try {
    // Ação é sempre passada como query parameter do sheets-api.js
    const action = req.query.action;
    
    // Constrói a URL final para o Google Apps Script
    const targetGasUrl = new URL(gasUrl);
    if (action) {
      targetGasUrl.searchParams.append('action', action);
    }
    // Repassa outros query parameters (se houver, como em GETs)
    for (const key in req.query) {
      if (key !== 'action') {
        targetGasUrl.searchParams.append(key, req.query[key]);
      }
    }

    // Prepara as opções para o 'fetch' para o Google Apps Script
    const fetchOptions = {
      method: req.method, // *** CRÍTICO: PRESERVA O MÉTODO HTTP ORIGINAL (GET, POST) ***
      headers: {
        'Content-Type': 'application/json', // Indica que o corpo da requisição é JSON
        'Accept': 'application/json',
      },
    };

    // Se a requisição original for POST (ou PUT/PATCH), inclua o corpo
    if (req.method === 'POST') {
      // req.body já é um objeto parseado pelo Vercel se Content-Type for application/json
      fetchOptions.body = JSON.stringify(req.body); // *** CRÍTICO: PASSA O CORPO JSON DA REQUISIÇÃO ORIGINAL ***
    }

    // Logs para depuração na função Vercel
    console.log('Vercel Function Log:');
    console.log('  Incoming Method:', req.method);
    console.log('  Incoming Query:', req.query);
    console.log('  Incoming Body:', req.body);
    console.log('  Forwarding to GAS URL:', targetGasUrl.toString());
    console.log('  Forwarding Method:', fetchOptions.method);
    console.log('  Forwarding Body (to GAS):', fetchOptions.body || 'N/A for GET'); // body será undefined para GET

    // Faz a requisição para o Google Apps Script
    const gasResponse = await fetch(targetGasUrl.toString(), fetchOptions);
    const gasData = await gasResponse.json();
    
    // Retorna a resposta do Google Apps Script para o frontend
    res.status(gasResponse.status).json(gasData); // Preserva o status code do GAS
  } catch (error) {
    console.error('Vercel Function Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno no proxy Vercel: ' + error.message, 
      stack: error.stack 
    });
  }
}
