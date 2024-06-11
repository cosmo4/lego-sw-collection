const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');
const path = require('path');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();

const startServer = () => {
  const legoSetRoute = require('./routes/legoSets');

  app.use(cors())
    .use(bodyParser.json())
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(express.static(path.join(__dirname, 'public')))
    .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    .use('/legoSets', legoSetRoute);

  // Serve index.html for the root URL
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
  });

  // Start listening for connections
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

const port = 8080;

mongodb.initDb((err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    console.log('Connected to the database');
    startServer();
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