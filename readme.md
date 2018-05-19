# AngularJS Authentication with Auth0

This repo shows how to implement authentication in an AngularJS 1.x application. It goes along with SitePoint's [Easy AngularJS Authentication with Auth0](https://www.sitepoint.com/easy-angularjs-authentication-with-auth0/) article.

## Getting Started

To run this quickstart you can fork and clone this repo. You will need an Auth0 account to run the example. [Sign up](https://auth0.com/signup) for a free account and then go to your [dashboard](https://manage.auth0.com) to get your credentials.

Be sure to set the correct values for your Auth0 application in the `auth0.variables.js` file.

To run the application:

```bash
# Install the dependencies
bower install

# Install simple web server
npm install -g http-server

# Run
http-server
```

To run the server:

Open the `server` directory and run

```bash
npm install
```

to install the dependencies needed for the server. Next open up the `server.js` file and add your credentials:

```js
var authCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://{YOUR-AUTH0-DOMAIN}.auth0.com/.well-known/jwks.json"
    }),
    audience: '{YOUR-AUTH0-API-IDENTIFIER}',
    issuer: "https://{YOUR-AUTH0-DOMAIN}.auth0.com/",
    algorithms: ['RS256']
});
```

Run the server by executing the `node server` command.
