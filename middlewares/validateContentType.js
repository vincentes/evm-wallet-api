const validateContentType = async (req, res, next) => {
  const contentType = req.headers['content-type'] || null;
  if (contentType === null) {
    res.status(400).send('The header content-type must be application/json');
  } else {
    next();
  }
};

module.exports = { validateContentType };
