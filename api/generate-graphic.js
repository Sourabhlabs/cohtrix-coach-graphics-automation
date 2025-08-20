export default function handler(req, res) {
  if (req.method === 'POST') {
    res.status(200).json({ 
      success: true, 
      message: 'API is working',
      data: req.body 
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
