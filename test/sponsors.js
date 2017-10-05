import chai from 'chai';
import chaiHttp from 'chai-http';
import env from '../src/config/env';
import Sponsor from '../src/models/sponsor';

// add chaiHttp to chai
chai.use(chaiHttp);

// define base url
const BASE_API_URL = `http://${env.host}:${env.port}`;

// call chai should
chai.should();

const sponsorsTests = () => {
  afterEach((done) => {
    Sponsor.remove({}, () => done());
  });

  describe('List', () => {
    it('it should GET all sponsors', (done) => {
      chai.request(BASE_API_URL)
        .get('/api/sponsors')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  describe('Create', () => {
    it('it should POST a sponsor', (done) => {
      const sponsor = { name: 'Sponsor', image: 'path_to_image' };
      chai.request(BASE_API_URL)
        .post('/api/sponsors')
        .send(sponsor)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.name.should.be.eql('Sponsor');
          res.body.image.should.be.eql('path_to_image');
          done();
        });
    });
  });

  describe('Read', () => {
    it('it should GET a sponsor by id', (done) => {
      const sponsor = new Sponsor({ name: 'Sponsor', image: 'path_to_image' });
      sponsor.save((error, savedSponsor) => {
        chai.request(BASE_API_URL)
          .get(`/api/sponsors/${savedSponsor._id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.name.should.be.eql('Sponsor');
            res.body.image.should.be.eql('path_to_image');
            done();
          });
      });
    });
  });

  describe('Update', () => {
    it('it should PUT a sponsor', (done) => {
      const updates = { name: 'SponsorUpdated' };
      const sponsor = new Sponsor({ name: 'Sponsor', image: 'path_to_image' });
      sponsor.save((error, savedSponsor) => {
        chai.request(BASE_API_URL)
          .put(`/api/sponsors/${savedSponsor._id}`)
          .send(updates)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.name.should.be.eql('SponsorUpdated');
            res.body.image.should.be.eql('path_to_image');
            done();
          });
      });
    });
  });

  describe('Remove', () => {
    it('it should DELETE a sponsor', (done) => {
      const sponsor = new Sponsor({ name: 'Sponsor', image: 'path_to_image' });
      sponsor.save((error, savedSponsor) => {
        chai.request(BASE_API_URL)
          .delete(`/api/sponsors/${savedSponsor._id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.name.should.be.eql('Sponsor');
            res.body.image.should.be.eql('path_to_image');
            done();
          });
      });
    });
  });
};

export default sponsorsTests;
