var fs = require('fs');

var secret = "";
var client_id = "";

if (process.env.NODE_ENV == "production") {
    secret = fs.readFileSync('/home/ec2-user/dist/config/keys/fitbit_secret.txt', 'utf8');
    client_id = fs.readFileSync('/home/ec2-user/dist/config/keys/fitbit_client.txt', 'utf8');
} else {
    secret = fs.readFileSync('./config/keys/fitbit_secret.txt', 'utf8');
    client_id = fs.readFileSync('./config/keys/fitbit_client.txt', 'utf8');
}

// Set the client credentials and the OAuth2 server
var credentials = {
  clientID: client_id,
  clientSecret: secret,
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
