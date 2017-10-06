import * as app from '../src/config/lib/app';
import * as db from '../src/config/lib/db';
import documentsTests from './documents';
import newsTests from './news';
import photosTests from './photos';
import sponsorsTests from './sponsors';
import tagCloudsTests from './tagclouds';
import membersTests from './members';
import usersTests from './users';
import questionsTests from './questions';
import rightsTests from './rights';
import authenticationTests from './authentication';
import threadsTests from './threads';

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
  describe('Members', membersTests);
  describe('Questions', questionsTests);
  describe('Threads', threadsTests);
  // @TODO: test tasks, workflows and votes
});
