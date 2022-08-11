const validateContentType = async (req, res, next) => {
  const contentType = req.headers['content-type'] || null;
  if (!contentType || !req.body) {
    res.status(400).json({
      msg: 'Invalid Parameter',
    });
  } else {
    next();
  }
};

module.exports = { validateContentType };
