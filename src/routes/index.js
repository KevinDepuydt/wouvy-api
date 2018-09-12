import authenticationRoutes from './authentication';
import documentsRoutes from './documents';
import membersRoutes from './members';
import newsRoutes from './news';
import photosRoutes from './photos';
import questionsRoutes from './questions';
import rightsRoutes from './rights';
import sponsorsRoutes from './sponsors';
import tagCloudsRoutes from './tagclouds';
import tasksRoutes from './tasks';
import threadsRoutes from './threads';
import usersRoutes from './users';
import votesRoutes from './votes';
import workflowsRoutes from './workflows';
import searchRoutes from './search';
import uploadsRoutes from './uploads';
import newsFeedRoutes from './news-feed';
import postsRoutes from './posts';
import pollsRoutes from './polls';

// server set routes in order of routes array
// authentication have to stay in first position to secure other routes
const routes = [
  authenticationRoutes,
  documentsRoutes,
  membersRoutes,
  newsRoutes,
  photosRoutes,
  questionsRoutes,
  rightsRoutes,
  sponsorsRoutes,
  tagCloudsRoutes,
  tasksRoutes,
  threadsRoutes,
  usersRoutes,
  votesRoutes,
  workflowsRoutes,
  searchRoutes,
  uploadsRoutes,
  newsFeedRoutes,
  postsRoutes,
  pollsRoutes,
];

export default routes;
