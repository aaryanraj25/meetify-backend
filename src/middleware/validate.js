exports.validateUser = (req, res, next) => {
  const { email, password, firstName, lastName, role } = req.body;
  if (!email || !password || !firstName || !lastName || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
  }
  next();
};
