import chai from 'chai';
import chaiHttp from 'chai-http';
import env from '../src/config/env';
import TagCloud from '../src/models/tagcloud';

// add chaiHttp to chai
chai.use(chaiHttp);

// define base url
const BASE_API_URL = `http://${env.host}:${env.port}`;

// call chai should
chai.should();

const tagCloudsTests = () => {
  afterEach((done) => {
    TagCloud.remove({}, () => done());
  });

  describe('List', () => {
    it('it should GET all tagClouds', (done) => {
      chai.request(BASE_API_URL)
        .get('/api/tag-clouds')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  describe('Create', () => {
    it('it should POST a tagCloud', (done) => {
      const tagCloud = { theme: 'TagCloud', words: ['One', 'Two'] };
      chai.request(BASE_API_URL)
        .post('/api/tag-clouds')
        .send(tagCloud)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.theme.should.be.eql('TagCloud');
          res.body.words.should.have.lengthOf(2);
          done();
        });
    });
  });

  describe('Read', () => {
    it('it should GET a tagCloud by id', (done) => {
      const tagCloud = new TagCloud({ theme: 'TagCloud', words: ['One', 'Two'] });
      tagCloud.save((error, savedTagCloud) => {
        chai.request(BASE_API_URL)
          .get(`/api/tag-clouds/${savedTagCloud._id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.theme.should.be.eql('TagCloud');
            res.body.words.should.have.lengthOf(2);
            done();
          });
      });
    });
  });

  describe('Update', () => {
    it('it should PUT a tagCloud', (done) => {
      const updates = { theme: 'TagCloudUpdated' };
      const tagCloud = new TagCloud({ theme: 'TagCloud', words: ['One', 'Two'] });
      tagCloud.save((error, savedTagCloud) => {
        chai.request(BASE_API_URL)
          .put(`/api/tag-clouds/${savedTagCloud._id}`)
          .send(updates)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.theme.should.be.eql('TagCloudUpdated');
            res.body.words.should.have.lengthOf(2);
            done();
          });
      });
    });
  });

  describe('Remove', () => {
    it('it should DELETE a tagCloud', (done) => {
      const tagCloud = new TagCloud({ theme: 'TagCloud', words: ['One', 'Two'] });
      tagCloud.save((error, savedTagCloud) => {
        chai.request(BASE_API_URL)
          .delete(`/api/tag-clouds/${savedTagCloud._id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.theme.should.be.eql('TagCloud');
            res.body.words.should.have.lengthOf(2);
            done();
          });
      });
    });
  });
};

export default tagCloudsTests;
