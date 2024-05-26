const express = require('express');
const router = express.Router();
// maybe youll need this? const legoSetController = require('../controllers/legoSetController');
const legoSetRoute = require('./legoSets');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerDocument = require('../swagger/swagger.json');

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

router.get('/legoSets', legoSetRoute);

router.use(
    '/',
    (docData = (req, res) => {
      let docData = {
        documentationURL: 'https://localhost:8080/api-docs',
      };
      res.send(docData);
    })
  );

module.exports = router;