import authenticationRoutes from './authentication';
import usersRoutes from './users';
import documentsRoutes from './documents';

// server set routes in order of routes array
// authentication have to stay in first position to secure other routes
const routes = [
  authenticationRoutes,
  usersRoutes,
  documentsRoutes,
];

export default routes;
