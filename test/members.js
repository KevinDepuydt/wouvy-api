/*
import chai from 'chai';
import chaiHttp from 'chai-http';
import env from '../src/config/env';
import User from '../src/models/user';
import Member from '../src/models/member';

// add chaiHttp to chai
chai.use(chaiHttp);

// define base url
const BASE_API_URL = `http://${env.host}:${env.port}`;

// call chai should
chai.should();

const USER_DATA = {
  email: 'test@wouvy.fr',
  firstname: 'First',
  lastname: 'Last',
  password: 'Password',
};

const membersTests = () => {
  afterEach((done) => {
    User.remove({}, () => {
      Member.remove({}, () => done());
    });
  });

  describe('List', () => {
    it('it should GET all the members', (done) => {
      chai.request(BASE_API_URL)
        .get('/api/members')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  describe('Create', () => {
    it('it should POST a member', (done) => {
      const user = new User(USER_DATA);
      user.save((error, savedUser) => {
        const memberData = { user: savedUser };
        chai.request(BASE_API_URL)
          .post('/api/members')
          .send(memberData)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.user.should.be.eql(savedUser._id.toString());
            done();
          });
      });
    });
  });

  describe('Read', () => {
    it('it should GET a member by id', (done) => {
      const user = new User(USER_DATA);
      user.save((errorUser, savedUser) => {
        const member = new Member({ user: savedUser });
        member.save((errorMember, savedMember) => {
          chai.request(BASE_API_URL)
            .get(`/api/members/${savedMember._id}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body._id.should.be.eql(savedMember._id.toString());
              res.body.user.should.be.eql(savedUser._id.toString());
              done();
            });
        });
      });
    });
  });

  describe('Update', () => {
    it('it should PUT a member', (done) => {
      const updates = { rights: { workflows: env.rights.PARTICIPATE.level } };
      const user = new User(USER_DATA);
      user.save((errorUser, savedUser) => {
        const member = new Member({ user: savedUser });
        member.save((errorMember, savedMember) => {
          chai.request(BASE_API_URL)
            .put(`/api/members/${savedMember._id}`)
            .send(updates)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.rights.workflows.should.be.eql(env.rights.PARTICIPATE.level);
              res.body.rights.documents.should.be.eql(env.rights.NONE.level);
              done();
            });
        });
      });
    });
  });

  describe('Remove', () => {
    it('it should DELETE a member', (done) => {
      const user = new User(USER_DATA);
      user.save((errorUser, savedUser) => {
        const member = new Member({ user: savedUser });
        member.save((errorMember, savedMember) => {
          chai.request(BASE_API_URL)
            .delete(`/api/members/${savedMember._id}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.user.should.be.eql(savedUser._id.toString());
              done();
            });
        });
      });
    });
  });
};

export default membersTests;
*/
