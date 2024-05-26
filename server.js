const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();

const startServer = () => {
    const legoSetRoute = require('./routes/legoSets');

    app.use(bodyParser.json())
    .use(cors())
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use('/legoSets', legoSetRoute)
    .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
    });
}
const port = 8080;

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Connected to DB and listening on port ${port}`);
      startServer();
    });
  }
});

// app.use(bodyParser.json()).use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     next();
//   })
//   .use('/legoSets', legoSetRoute);

// app
//   .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
//   .use(cors())
//   .use(express.json())
//   .use(express.urlencoded({ extended: true }))
//   .use('/', require('./routes'));

// const port = 8080;

// mongodb.initDb((err, mongodb) => {
//     if (err) {
//       console.log(err);
//     } else {
//       app.listen(port);
//       console.log(`Connected to DB and listening on ${port}`);
//     }
//   });