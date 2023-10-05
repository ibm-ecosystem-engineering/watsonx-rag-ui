
const express = require('express');
const session = require('express-session');
const proxy = require('express-http-proxy');
const url = require('url');
const path = require('path');
const passport = require('passport');
const WebAppStrategy = require("ibmcloud-appid").WebAppStrategy;

const CALLBACK_URL = "/ibm/cloud/appid/callback";
const LOGOUT_URL = "/ibm/cloud/appid/logout";
const LOGOUT2_URL = "/logout";
const LOGIN_URL = "/ibm/cloud/appid/login";
const LOGIN2_URL = "/login";
const LANDING_PAGE_URL = "/";
const CHANGE_PASSWORD_URL = "/ibm/cloud/appid/change_password";
const CHANGE_PASSWORD2_URL = "/change_password";
const FORGOT_PASSWORD_URL = "/ibm/cloud/appid/forgot_password";
const FORGOT_PASSWORD2_URL = "/forgot_password";

const BACKEND_HOST = process.env.BACKEND_HOST || 'localhost:3000'
const PORT = process.env.PORT || '8080'
const HOST = process.env.HOST || 'http://localhost:8080'

const buildAppIdConfig = () => {
  const result = {
    clientId: process.env.APPID_CLIENT_ID,
    tenantId: process.env.APPID_TENANT_ID,
    secret: process.env.APPID_SECRET,
    oAuthServerUrl: process.env.OAUTH_SERVER_URL,
    redirectUri: `${HOST}${CALLBACK_URL}`
  }

  if (!result.clientId || !result.tenantId || !result.secret || !result.oAuthServerUrl) {
    throw new Error('APPID_CLIENT_ID, APPID_TENANT_ID, APPID_SECRET, or OAUTH_SERVER_URL environment variable missing')
  }

  return result;
}

const COOKIE_NAME = 'refreshToken'

const createServer = () => {
  const app = express();
  app.use(session({
    secret: "654321",
    resave: true,
    saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  const webAppStrategy = new WebAppStrategy(buildAppIdConfig())

  passport.use(webAppStrategy);

  passport.serializeUser((user, cb) => {
    cb(null, user);
  });
  passport.deserializeUser((obj, cb) => {
    cb(null, obj);
  });

  app.get(CALLBACK_URL, passport.authenticate(WebAppStrategy.STRATEGY_NAME, { keepSessionInfo: true }));

  app.get(LOGIN_URL, passport.authenticate(WebAppStrategy.STRATEGY_NAME, {
    successRedirect: LANDING_PAGE_URL,
    forceLogin: true
  }));
  app.get(LOGIN2_URL, passport.authenticate(WebAppStrategy.STRATEGY_NAME, {
    successRedirect: LANDING_PAGE_URL,
    forceLogin: true
  }));

  app.get(FORGOT_PASSWORD_URL, passport.authenticate(WebAppStrategy.STRATEGY_NAME, {
    successRedirect: LANDING_PAGE_URL,
    show: WebAppStrategy.FORGOT_PASSWORD
  }));
  app.get(FORGOT_PASSWORD2_URL, passport.authenticate(WebAppStrategy.STRATEGY_NAME, {
    successRedirect: LANDING_PAGE_URL,
    show: WebAppStrategy.FORGOT_PASSWORD
  }));

  app.get(CHANGE_PASSWORD_URL, passport.authenticate(WebAppStrategy.STRATEGY_NAME, {
    successRedirect: LANDING_PAGE_URL,
    show: WebAppStrategy.CHANGE_PASSWORD
  }));
  app.get(CHANGE_PASSWORD2_URL, passport.authenticate(WebAppStrategy.STRATEGY_NAME, {
    successRedirect: LANDING_PAGE_URL,
    show: WebAppStrategy.CHANGE_PASSWORD
  }));

  const logout = (req, res) => {
    console.log('Logging out')
    req._sessionManager = false;
    WebAppStrategy.logout(req);
    req.logout();
    req.session = null;
    res.clearCookie(COOKIE_NAME);
    res.redirect(LANDING_PAGE_URL);
  }
  app.get(LOGOUT_URL, logout);
  app.get(LOGOUT2_URL, logout);

  const apiProxy = proxy(BACKEND_HOST, {
    proxyReqPathResolver: req => url.parse(req.baseUrl).path
  });
  app.use('/api/*', apiProxy);

  const graphqlProxy = proxy(`${BACKEND_HOST}/graphql`, {
    proxyReqPathResolver: req => url.parse(req.baseUrl).path
  });
  app.use('/graphql/*', graphqlProxy);
  app.use('/graphql', graphqlProxy);

  const subscriptionProxy = proxy(`${BACKEND_HOST}/subscription`, {
    proxyReqPathResolver: req => url.parse(req.baseUrl).path
  });
  app.use('/subscription/*', subscriptionProxy);
  app.use('/subscription', subscriptionProxy);

  function storeRefreshTokenInCookie(req, res, next) {
    const refreshToken = req.session[WebAppStrategy.AUTH_CONTEXT][COOKIE_NAME];
    console.log('Storing refresh token: ', {refreshToken})
    if (refreshToken) {
      /* An example of storing user's refresh-token in a cookie with expiration of a month */
      res.cookie(COOKIE_NAME, refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30 /* 30 days */
      });
    }
    next();
  }

  function isLoggedIn(req) {
    const result = req.session[WebAppStrategy.AUTH_CONTEXT];

    console.log('isLoggedIn? ', result)

    return result;
  }

  function tryToRefreshTokenIfNotLoggedIn(req, res, next) {
    if (isLoggedIn(req)) {
      return next();
    }

    const refreshToken = (req.cookies || {})[COOKIE_NAME]
    if (!refreshToken) {
      return next();
    }

    console.log('Refreshing tokens')
    webAppStrategy.refreshTokens(req, refreshToken).then(function () {
      console.log('Next')
      next();
    }).catch(err => console.error('Error refreshing tokens: ', {err}));
  }

  app.get(
    "/secure/*",
    tryToRefreshTokenIfNotLoggedIn,
    passport.authenticate(WebAppStrategy.STRATEGY_NAME, { keepSessionInfo: true }),
    storeRefreshTokenInCookie,
    (req, res) => {
      res.sendFile(path.resolve(__dirname, '..', 'dist', 'index.html'))
    }
  );

  //
  // app.get(
  //   "/secure/*",
  //   passport.authenticate(WebAppStrategy.STRATEGY_NAME),
  //   (req, res) => {
  //     res.sendFile(path.resolve(__dirname, '..', 'dist', 'index.html'))
  //   }
  // );

  // app.get('*', passport.authenticate(WebAppStrategy.STRATEGY_NAME), (req, res) => {
  //   res.sendFile(path.resolve(__dirname, '..', 'dist', 'index.html'))
  // })
  // app.get('*', (req, res) => {
  //   res.sendFile(path.resolve(__dirname, '..', 'dist', 'index.html'))
  // })
  app.use(express.static(path.join(__dirname, '..', 'dist')))


  return app;
}

createServer().listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})