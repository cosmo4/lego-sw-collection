const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const { authorize, getUserInfo } = require('./oauth');
const { findUserByEmail, createUser } = require('./models/user')

const app = express();
const port = 8080;

const startServer = () => {
  const legoSetRoute = require('./routes/legoSets');

  app.use(cors())
    .use(bodyParser.json())
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(express.static(path.join(__dirname, 'public')))
    .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    .use('/legoSets', legoSetRoute);

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  app.get('/oauth', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'oauth.html'));
  });

  // Route to handle OAuth process
  app.get('/auth/google', async (req, res) => {
    try {
      const client = await authorize();
      const userInfo = await getUserInfo(client);

      // Check if the user already exists
      let user = await findUserByEmail(userInfo.email);
      if (!user) {
        // Create a new user if it does not exist
        const result = await createUser(userInfo);
        user = { _id: result.insertedId, ...userInfo };
      }

      // Store user information in session or JWT
      // For now, we'll just log the user info
      console.log('User info:', user);

      res.redirect('/');
    } catch (error) {
      console.error('Error during OAuth process:', error);
      res.status(500).send('OAuth process failed.');
    }
  });

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
  });

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

mongodb.initDb((err) => {
  if (err) {
    console.error(err);
    process.exit(1); // Exit the process with a failure code
  } else {
    console.log('Connected to the database');
    startServer();
  }
});
