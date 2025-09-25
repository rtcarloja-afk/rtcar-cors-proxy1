module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log(`Método recebido: ${req.method}`);

  if (req.method === 'GET') {
    res.status(200).json({
      success: true,
      message: 'API RT Car Check-in funcionando!',
      timestamp: new Date().toISOString(),
      method: 'GET'
    });
  } else if (req.method === 'POST') {
    const { userId, location } = req.body;
    res.status(200).json({
      success: true,
      message: 'Check-in registrado!',
      data: { userId, location }
    });
  } else {
    res.status(405).json({ 
      success: false,
      error: 'Método não permitido' 
    });
  }
};
