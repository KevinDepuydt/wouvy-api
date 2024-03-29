import * as app from '../src/config/lib/app';
import * as db from '../src/config/lib/db';
import documentsTests from './documents';
import newsTests from './news';
import photosTests from './photos';
import sponsorsTests from './sponsors';
import tagCloudsTests from './tagclouds';
import usersTests from './users';
import questionsTests from './questions';
import rightsTests from './rights';
import authenticationTests from './authentication';
import threadsTests from './threads';
import tasksTests from './tasks';
import votesTests from './votes';
import workflowsTests from './workflows';
import membersTests from './members';

describe('API', () => {
  before((done) => {
    app.start(() => done());
  });

  after(() => {
    // drop test db and exit test
    db.dropDatabase().then(() => {
      process.exit(0);
    });
  });

  describe('Authentication', authenticationTests);
  describe('Users', usersTests);
  describe('Rights', rightsTests);
  describe('Documents', documentsTests);
  describe('News', newsTests);
  describe('Photos', photosTests);
  describe('Sponsors', sponsorsTests);
  describe('TagClouds', tagCloudsTests);
  describe('Questions', questionsTests);
  describe('Threads', threadsTests);
  describe('Tasks', tasksTests);
  describe('Votes', votesTests);
  describe('Workflows', workflowsTests);
  describe('Members', membersTests);
});
