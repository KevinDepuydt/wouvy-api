import usersRoutes from './users';
import authenticationRoutes from './authentication';

// server set routes in order of routes array
// authentication have to stay in first position to secure other routes
const routes = [
  authenticationRoutes,
  usersRoutes,
];

export default routes;
