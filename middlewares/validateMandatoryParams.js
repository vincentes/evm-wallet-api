const validateMandatoryParams = async (req, res, next) => {
  const { requestId } = req.body;
  const userId = req.body.requestId;
  const { serverDateTime } = req.body;

  if (!requestId || !userId || !serverDateTime) {
    let missingParam = '';
    if (!requestId) {
      missingParam = 'RequestID';
    }

    if (!userId) {
      missingParam = 'UserID';
    }

    if (!serverDateTime) {
      missingParam = 'ServerDateTime';
    }

    res.status(400).json({ message: `Missing ${missingParam} parameter.` });
  } else {
    next();
  }
};

module.exports = { validateMandatoryParams };
