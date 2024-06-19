const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const { requiresAuth } = require('express-openid-connect');

const app = express();
const port = 8080;

const startServer = () => {
  const legoSetRoute = require('./routes/legoSets');

  const { auth } = require('express-openid-connect');
  
  const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: 'https://lego-sw-collection.onrender.com',
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_BASE_URL
  };
  
  // auth router attaches /login, /logout, and /callback routes to the baseURL
  app.use(auth(config));
  
  app.use(cors())
    .use(bodyParser.json())
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(express.static(path.join(__dirname, 'public')))
    .use('/api-docs', requiresAuth(), swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    .use('/legoSets', requiresAuth(), legoSetRoute);

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  // req.isAuthenticated is provided from the auth router
  app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
  });
  
  app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
  });
  
  app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).send('Unauthorized: Access is denied due to invalid credentials.');
    } else {
      next(err);
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
