// Testing module format compatibility
export default function handler(req, res) {
  return res.status(200).json({
    success: true,
    message: 'API endpoint with default export working correctly',
    time: new Date().toISOString()
  });
} 