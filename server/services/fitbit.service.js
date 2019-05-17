/* eslint-disable import/no-unresolved */
// Set the client credentials and the OAuth2 server
const credentials = {
  clientID: '228MZ3>',
  clientSecret: '1b057c2e46b0dd19ec40cba83f9d8da3',
  site: 'https://api.fitbit.com'
};

// Initialize the OAuth2 Library
const oauth2 = require('simple-oauth2-promise')(credentials);

// Authorization oauth2 URI
// eslint-disable-next-line no-unused-vars
const authorizationUri = oauth2.authCode.authorizeURL({
  redirect_uri: 'https://www.fitbit.com/oauth2/authorize',
  scope: 'activity',
  state: 'kmca'
});

// Save the access token
const saveToken = (error, result) => {
  if (error) {
    console.log('Access Token Error', error.message);
  }

  const token = oauth2.accessToken.create(result);

  console.log(token);
};

oauth2.authCode.getToken({
  code: '<code>',
  redirect_uri: 'https://api.fitbit.com/oauth2/token'
}, saveToken);
