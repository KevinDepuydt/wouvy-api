import * as app from '../src/config/lib/app';
import * as db from '../src/config/lib/db';
import documentsTests from './documents';
import newsTests from './news';
import photosTests from './photos';

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

  describe('Documents', documentsTests);
  describe('News', newsTests);
  describe('Photo', photosTests);
});
