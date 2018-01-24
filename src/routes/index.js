import authenticationRoutes from './authentication';
import usersRoutes from './users';
import workflowsRoutes from './workflows';
import documentsRoutes from './documents';
import newsRoutes from './news';
import photosRoutes from './photos';
import questionsRoutes from './questions';
import rightsRoutes from './rights';
import sponsorsRoutes from './sponsors';
import tagCloudsRoutes from './tagclouds';
import tasksRoutes from './tasks';
import threadsRoutes from './threads';
import votesRoutes from './votes';

// server set routes in order of routes array
// authentication have to stay in first position to secure other routes
const routes = [
  authenticationRoutes,
  usersRoutes,
  workflowsRoutes,
  documentsRoutes,
  newsRoutes,
  photosRoutes,
  questionsRoutes,
  rightsRoutes,
  sponsorsRoutes,
  tagCloudsRoutes,
  tasksRoutes,
  threadsRoutes,
  votesRoutes,
];

export default routes;
