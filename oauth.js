const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
    access_token: client.credentials.access_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    client = await refreshTokenIfNeeded(client);
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Refresh the token if it's expired.
 *
 * @param {OAuth2Client} client
 * @return {Promise<OAuth2Client>}
 */
async function refreshTokenIfNeeded(client) {
  if (client.credentials.expiry_date && client.credentials.expiry_date <= Date.now()) {
    const refreshedToken = await client.refreshAccessToken();
    client.setCredentials(refreshedToken.credentials);
    await saveCredentials(client);
  }
  return client;
}

/**
 * Get user profile information.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @return {Promise<Object>}
 */
async function getUserInfo(auth) {
  const oauth2 = google.oauth2({
    auth: auth,
    version: 'v2'
  });
  const res = await oauth2.userinfo.get();
  return res.data;
}

module.exports = {
  authorize,
  getUserInfo
};
