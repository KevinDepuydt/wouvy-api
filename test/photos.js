import chai from 'chai';
import chaiHttp from 'chai-http';
import env from '../src/config/env';
import Photo from '../src/models/photo';

// add chaiHttp to chai
chai.use(chaiHttp);

// define base url
const BASE_API_URL = `http://${env.host}:${env.port}`;

// call chai should
chai.should();

const photosTests = () => {
  afterEach((done) => {
    Photo.remove({}, () => done());
  });

  describe('List', () => {
    it('it should GET all photos', (done) => {
      chai.request(BASE_API_URL)
        .get('/api/photos')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  describe('Create', () => {
    it('it should POST a photo', (done) => {
      const photoData = { title: 'Photo', image: 'path_to_image' };
      chai.request(BASE_API_URL)
        .post('/api/photos')
        .send(photoData)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.title.should.be.eql('Photo');
          res.body.image.should.be.eql('path_to_image');
          done();
        });
    });
  });

  describe('Read', () => {
    it('it should GET a photo by id', (done) => {
      const photo = new Photo({ title: 'Photo', image: 'path_to_image' });
      photo.save((error, savedPhoto) => {
        chai.request(BASE_API_URL)
          .get(`/api/photos/${savedPhoto._id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.title.should.be.eql('Photo');
            res.body.image.should.be.eql('path_to_image');
            done();
          });
      });
    });
  });

  describe('Update', () => {
    it('it should PUT a photo', (done) => {
      const updates = { title: 'PhotoUpdated' };
      const photo = new Photo({ title: 'Photo', image: 'path_to_image' });
      photo.save((error, savedPhoto) => {
        chai.request(BASE_API_URL)
          .put(`/api/photos/${savedPhoto._id}`)
          .send(updates)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.title.should.be.eql('PhotoUpdated');
            res.body.image.should.be.eql('path_to_image');
            done();
          });
      });
    });
  });

  describe('Remove', () => {
    it('it should DELETE a photo', (done) => {
      const photo = new Photo({ title: 'Photo', image: 'path_to_image' });
      photo.save((error, savedPhoto) => {
        chai.request(BASE_API_URL)
          .delete(`/api/photos/${savedPhoto._id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.title.should.be.eql('Photo');
            res.body.image.should.be.eql('path_to_image');
            done();
          });
      });
    });
  });
};

export default photosTests;
