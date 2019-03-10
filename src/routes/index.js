import authenticationRoutes from './authentication';
import rightsRoutes from './rights';
import tasksRoutes from './tasks';
import threadsRoutes from './threads';
import usersRoutes from './users';
import workflowsRoutes from './workflows';
import searchRoutes from './search';
import uploadsRoutes from './uploads';
import newsFeedRoutes from './news-feed';
import postsRoutes from './posts';
import pollsRoutes from './polls';
import libraryRoutes from './library';

// server set routes in order of routes array
// authentication have to stay in first position to secure other routes
const routes = [
  authenticationRoutes,
  rightsRoutes,
  tasksRoutes,
  threadsRoutes,
  usersRoutes,
  workflowsRoutes,
  searchRoutes,
  uploadsRoutes,
  newsFeedRoutes,
  postsRoutes,
  pollsRoutes,
  libraryRoutes,
];

export default routes;
