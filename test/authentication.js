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

const USER_DATA = { email: 'test@wouvy.fr', firstname: 'First', lastname: 'Last', password: 'Password' };

const authenticationTests = () => {
  afterEach((done) => {
    User.remove({}, () => done());
  });

  describe('Signup', () => {
    it('it should sign up an user', (done) => {
      chai.request(BASE_API_URL)
        .post('/api/authentication/signup')
        .send(USER_DATA)
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

  describe('Signin', () => {
    it('it should sign in an user', (done) => {
      const user = new User(USER_DATA);
      user.save(() => {
        chai.request(BASE_API_URL)
          .post('/api/authentication/signin')
          .send(USER_DATA)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.user.email.should.be.eql('test@wouvy.fr');
            res.body.user.should.not.have.property('password');
            res.body.token.should.be.a('string');
            done();
          });
      });
    });
  });
};

export default authenticationTests;
