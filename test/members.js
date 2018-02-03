import chai from 'chai';
import chaiHttp from 'chai-http';
import env from '../src/config/env';
import User from '../src/models/user';
import Member from '../src/models/member';
import Workflow from '../src/models/workflow';

// add chaiHttp to chai
chai.use(chaiHttp);

// define base url
const BASE_API_URL = `http://${env.host}:${env.port}`;

// call chai should
chai.should();

const USER_DATA = { email: 'test@wouvy.fr', firstname: 'First', lastname: 'Last', password: 'Password' };

const membersTests = () => {
  let workflow;

  beforeEach((done) => {
    workflow = new Workflow({ name: 'test' });
    workflow.save().then(() => done());
  });

  afterEach((done) => {
    User.remove({}, () => {
      Member.remove({}, () => done());
    });
  });

  describe('List', () => {
    it('it should GET all the members', (done) => {
      chai.request(BASE_API_URL)
        .get(`/api/workflows/${workflow._id}/members`)
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
        const memberData = { user: savedUser, workflowId: workflow._id };
        chai.request(BASE_API_URL)
          .post(`/api/workflows/${workflow._id}/members`)
          .send(memberData)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.workflow.members.length.should.be.eql(1);
            done();
          });
      });
    });
  });

  describe('Read', () => {
    it('it should GET a member by id', (done) => {
      const user = new User(USER_DATA);
      user.save((errorUser, savedUser) => {
        const member = new Member({ user: savedUser, workflowId: workflow._id });
        member.save((errorMember, savedMember) => {
          chai.request(BASE_API_URL)
            .get(`/api/workflows/${workflow._id}/members/${savedMember._id}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body._id.should.be.eql(savedMember._id.toString());
              res.body.user._id.should.be.eql(savedUser._id.toString());
              done();
            });
        });
      });
    });
  });

  describe('Update', () => {
    it('it should PUT a member', (done) => {
      const updates = { role: 'admin' };
      const user = new User(USER_DATA);
      user.save((errorUser, savedUser) => {
        const member = new Member({ user: savedUser, workflowId: workflow._id });
        member.save((errorMember, savedMember) => {
          chai.request(BASE_API_URL)
            .put(`/api/workflows/${workflow._id}/members/${savedMember._id}`)
            .send(updates)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.role.should.be.eql('admin');
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
        const member = new Member({ user: savedUser, workflowId: workflow._id });
        member.save((errorMember, savedMember) => {
          chai.request(BASE_API_URL)
            .delete(`/api/workflows/${workflow._id}/members/${savedMember._id}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body._id.should.be.eql(workflow._id.toString());
              done();
            });
        });
      });
    });
  });
};

export default membersTests;
