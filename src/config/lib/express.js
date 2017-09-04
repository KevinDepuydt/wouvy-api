import express from 'express';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import routes from '../../routes';

/**
 * Initialize application middleware
 */
const initMiddleware = (app) => {
  // request body parsing middleware, should be above methodOverride
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  // override client method when doesn't exists
  app.use(methodOverride());
  // Add the cookie parser middleware
  app.use(cookieParser());
};

/**
 * Configure Helmet headers configuration
 */
const initHelmetHeaders = (app) => {
  // Use helmet to secure Express headers
  const SIX_MONTHS = 15778476000;
  app.use(helmet.frameguard());
  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.use(helmet.hsts({
    maxAge: SIX_MONTHS,
    includeSubdomains: true,
    force: true
  }));
  app.disable('x-powered-by');
};

/**
 * Configure app routes based on
 */
const initApiRoutes = (app) => {
  Object.keys(routes).forEach((routeName) => app.use(`/api/${routeName}`, routes[routeName]));
};

/**
 * Configure error handling
 */
const initErrorHandler = (app) => {
  app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    res.status(err.status || 500).send({ message: err.message });
  });
};

/**
 * Initialize the Express application
 */
export const init = () => {
  // Initialize express app
  const app = express();

  // Initialize Express middleware
  initMiddleware(app);

  // Initialize Helmet security headers
  initHelmetHeaders(app);

  // Initialize API routes
  initApiRoutes(app);

  // Initialize error routes
  initErrorHandler(app);

  return app;
};
