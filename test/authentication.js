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
        .post('/api/auth/signup')
        .send(USER_DATA)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.token.should.be.a('string');
          done();
        });
    });
  });

  describe('Signin', () => {
    it('it should sign in an user', (done) => {
      const user = new User(USER_DATA);
      user.save(() => {
        chai.request(BASE_API_URL)
          .post('/api/auth/signin')
          .send(USER_DATA)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.token.should.be.a('string');
            done();
          });
      });
    });
  });
};

export default authenticationTests;
