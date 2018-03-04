import http from 'http';
import express from 'express';
import socketIo from 'socket.io';
import passport from 'passport';
import session from 'express-session';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from '../../routes';
import passportStrategies from '../../strategies';
import env from '../env';
import { getUpload } from '../../controllers/uploads';

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
  // Logger dev
  app.use(morgan('dev'));
  // passport settings
  app.use(session({
    secret: 'MyAPISecretKeyToChange',
    resave: false,
    saveUninitialized: false,
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  // ALLOW CORS
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', env.appUrl);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-api-token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
  });
};

/**
 * Configure Helmet headers configuration
 * @param app
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
    force: true,
  }));
  app.disable('x-powered-by');
};

/**
 * Initialize passport strategies
 */
const initPassportStrategies = () => {
  passportStrategies(passport);
};

/**
 * Configure app routes based on routes index object
 * @param app
 */
const initApiRoutes = (app) => {
  // download uploaded files
  app.use('/upload/:filename', getUpload);
  // api routes
  routes.forEach(route => app.use('/api', route));
};

/**
 * Configure error handling
 * @param app
 */
const initErrorHandler = (app) => {
  app.use((req, res) => {
    const err = new Error('Not Found');
    err.status = 404;
    res.status(err.status || 500).send({ message: err.message });
  });
};

/**
 * Initialize socket io default events
 */
const initSocketIO = (io, app) => {
  // socket connect
  io.on('connect', (socket) => {
    console.log(`new socket ${socket.id} connected`);
    // socket join à room
    socket.on('join room', (room) => {
      socket.join(room);
      console.log(`${socket.id} join room ${room}`);
      socket.emit('message', `room ${room} joined`);
    });
    // socket leave a room
    socket.on('leave room', (room) => {
      socket.leave(room);
      console.log(`${socket.id} leave room ${room}`);
      socket.emit('message', `room ${room} leaved`);
    });
    // socket disconnect
    socket.on('disconnect', () => {
      console.log(`socket ${socket.id} disconnected`);
    });
  });

  // attach socket IO to requests
  app.use((req, res, next) => {
    req.io = io;
    next();
  });
};

/**
 * Initialize the Express application
 * @return app
 */
export const init = () => {
  // Initialize express app
  const app = express();
  // Initialize Socket.IO
  const server = http.Server(app);
  const io = socketIo(server);

  // Initialize Express middleware
  initMiddleware(app);

  // Initialize socket IO
  initSocketIO(io, app);

  // Initialize Passport strategies
  initPassportStrategies();

  // Initialize Helmet security headers
  initHelmetHeaders(app);

  // Initialize API routes
  initApiRoutes(app);

  // Initialize error routes
  initErrorHandler(app);

  return server;
};
