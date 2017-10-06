import chai from 'chai';
import chaiHttp from 'chai-http';
import env from '../src/config/env';
import User from '../src/models/user';

// add chaiHttp to chai
chai.use(chaiHttp);

// define base url
const BASE_API_URL = `http://${env.host}:${env.port}`;

// call chai should
chai.should();

const usersTests = () => {
  afterEach((done) => {
    User.remove({}, () => done());
  });

  describe('List', () => {
    it('it should GET all the users', (done) => {
      chai.request(BASE_API_URL)
        .get('/api/users')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  describe('Create', () => {
    it('it should POST a user', (done) => {
      const user = { firstname: 'First', lastname: 'Last', password: 'Password' };
      chai.request(BASE_API_URL)
        .post('/api/users')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.firstname.should.be.eql('First');
          res.body.lastname.should.be.eql('Last');
          res.body.password.should.not.be.eql('Password');
          done();
        });
    });
  });

  describe('Read', () => {
    it('it should GET a user by id', (done) => {
      const user = new User({ firstname: 'First', lastname: 'Last', password: 'Password' });
      user.save((errorUser, savedUser) => {
        chai.request(BASE_API_URL)
          .get(`/api/users/${savedUser._id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body._id.should.be.eql(savedUser._id.toString());
            res.body.firstname.should.be.eql(savedUser.firstname);
            res.body.lastname.should.be.eql(savedUser.lastname);
            done();
          });
      });
    });
  });

  describe('Update', () => {
    it('it should PUT a user', (done) => {
      const updates = { firstname: 'FirstUpdated' };
      const user = new User({ firstname: 'First', lastname: 'Last', password: 'Password' });
      user.save((errorUser, savedUser) => {
        chai.request(BASE_API_URL)
          .put(`/api/users/${savedUser._id}`)
          .send(updates)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.firstname.should.be.eql('FirstUpdated');
            res.body.lastname.should.be.eql('Last');
            done();
          });
      });
    });
  });

  describe('Remove', () => {
    it('it should DELETE a user', (done) => {
      const user = new User({ firstname: 'First', lastname: 'Last', password: 'Password' });
      user.save((errorUser, savedUser) => {
        chai.request(BASE_API_URL)
          .delete(`/api/users/${savedUser._id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.firstname.should.be.eql('First');
            done();
          });
      });
    });
  });
};

export default usersTests;
