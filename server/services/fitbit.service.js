// Set the client credentials and the OAuth2 server
var credentials = {
  clientID: '228MZ3>',
  clientSecret: '1b057c2e46b0dd19ec40cba83f9d8da3',
  site: 'https://api.fitbit.com'
};

// Initialize the OAuth2 Library
var oauth2 = require('simple-oauth2-promise')(credentials);

// Authorization oauth2 URI
var authorization_uri = oauth2.authCode.authorizeURL({
  redirect_uri: 'https://www.fitbit.com/oauth2/authorize',
  scope: 'activity',
  state: 'kmca'
});

// Redirect example using Express (see http://expressjs.com/api.html#res.redirect)
res.redirect(authorization_uri);

// Get the access token object (the authorization code is given from the previous step).
var token;
oauth2.authCode.getToken({
  code: '<code>',
  redirect_uri: 'https://api.fitbit.com/oauth2/token'
}, saveToken);

// Save the access token
function saveToken(error, result) {
  if (error) { console.log('Access Token Error', error.message); }
  token = oauth2.accessToken.create(result);
};
