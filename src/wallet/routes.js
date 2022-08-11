const express = require('express');

const controller = require('./controller/index');
const validateSchemas = require('../../middlewares/validateSchemas');
const schemas = require('./utils/schemasValidation');

const router = express.Router();

router.post(
  '/',
  validateSchemas.inputs(schemas.createWallet, 'body'),
  (req, res) => {
    controller.createWallet(res, req.body);
  }
);

module.exports = router;
