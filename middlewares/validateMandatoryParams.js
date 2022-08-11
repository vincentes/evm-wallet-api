const validateMandatoryParams = async (req, res, next) => {
  const { ServerDateTime, UserID, RequestID } = req.body;

  if (!RequestID || !UserID || !ServerDateTime) {
    let missingParam = '';
    if (!RequestID) {
      missingParam = 'RequestID';
    }

    if (!UserID) {
      missingParam = 'UserID';
    }

    if (!ServerDateTime) {
      missingParam = 'ServerDateTime';
    }

    res.status(400).json({ msg: `Invalid ${missingParam}` });
  } else {
    next();
  }
};

module.exports = { validateMandatoryParams };
