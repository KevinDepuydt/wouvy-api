import chai from 'chai';
import chaiHttp from 'chai-http';
import env from '../src/config/env';
import News from '../src/models/news';

// add chaiHttp to chai
chai.use(chaiHttp);

// define base url
const BASE_API_URL = `http://${env.host}:${env.port}`;

// call chai should
chai.should();

const newsTests = () => {
  afterEach((done) => {
    News.remove({}, () => done());
  });

  describe('List', () => {
    it('it should GET all news', (done) => {
      chai.request(BASE_API_URL)
        .get('/api/news')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  describe('Create', () => {
    it('it should POST a news', (done) => {
      const news = { title: 'News', description: 'test news' };
      chai.request(BASE_API_URL)
        .post('/api/news')
        .send(news)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.title.should.be.eql('News');
          res.body.description.should.be.eql('test news');
          done();
        });
    });
  });

  describe('Read', () => {
    it('it should GET a news by id', (done) => {
      const news = new News({ title: 'News', description: 'test news' });
      news.save((error, savedNews) => {
        chai.request(BASE_API_URL)
          .get(`/api/news/${savedNews._id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.title.should.be.eql('News');
            done();
          });
      });
    });
  });

  describe('Update', () => {
    it('it should PUT a news', (done) => {
      const updates = { title: 'NewsUpdated' };
      const news = new News({ title: 'News', description: 'test news' });
      news.save((error, savedNews) => {
        chai.request(BASE_API_URL)
          .put(`/api/news/${savedNews._id}`)
          .send(updates)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.title.should.be.eql('NewsUpdated');
            done();
          });
      });
    });
  });

  describe('Remove', () => {
    it('it should DELETE a news', (done) => {
      const news = new News({ title: 'News', description: 'test news' });
      news.save((error, savedNews) => {
        chai.request(BASE_API_URL)
          .delete(`/api/news/${savedNews._id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.title.should.be.eql('News');
            done();
          });
      });
    });
  });
};

export default newsTests;
