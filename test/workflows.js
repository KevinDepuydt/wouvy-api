import chai from 'chai';
import chaiHttp from 'chai-http';
import env from '../src/config/env';
import User from '../src/models/user';
import Workflow from '../src/models/workflow';

// add chaiHttp to chai
chai.use(chaiHttp);

// define base url
const BASE_API_URL = `http://${env.host}:${env.port}`;

// call chai should
chai.should();

const USER_DATA = { email: 'test@wouvy.fr', firstname: 'First', lastname: 'Last', password: 'Password' };

const workflowsTests = () => {
  afterEach((done) => {
    User.remove({}, () => {
      Workflow.remove({}, () => done());
    });
  });

  describe('List', () => {
    it('it should GET all the workflows', (done) => {
      chai.request(BASE_API_URL)
        .get('/api/workflows')
        .end((err, res) => {
          console.log(err);
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  describe('Create', () => {
    it('it should POST a workflow', (done) => {
      const user = new User(USER_DATA);
      user.save((error, savedUser) => {
        const workflowData = { name: 'Workflow', user: savedUser };
        chai.request(BASE_API_URL)
          .post('/api/workflows')
          .send(workflowData)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.name.should.be.eql('Workflow');
            done();
          });
      });
    });
  });

  describe('Read', () => {
    it('it should GET a workflow by id', (done) => {
      const user = new User(USER_DATA);
      user.save((errorUser, savedUser) => {
        const workflow = new Workflow({ name: 'Workflow', user: savedUser });
        workflow.save((errorWorkflow, savedWorkflow) => {
          chai.request(BASE_API_URL)
            .get(`/api/workflows/${savedWorkflow._id}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.name.should.be.eql('Workflow');
              res.body._id.should.be.eql(savedWorkflow._id.toString());
              res.body.user._id.should.be.eql(savedUser._id.toString());
              done();
            });
        });
      });
    });
  });

  describe('Update', () => {
    it('it should PUT a workflow', (done) => {
      const updates = { enabledFeatures: { documents: true } };
      const user = new User(USER_DATA);
      user.save((errorUser, savedUser) => {
        const workflow = new Workflow({ name: 'Workflow', user: savedUser });
        workflow.save((errorWorkflow, savedWorkflow) => {
          chai.request(BASE_API_URL)
            .put(`/api/workflows/${savedWorkflow._id}`)
            .send(updates)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.name.should.be.eql('Workflow');
              res.body.user._id.should.be.eql(savedUser._id.toString());
              res.body.enabledFeatures.documents.should.be.eql(true);
              res.body.enabledFeatures.tagClouds.should.be.eql(false);
              done();
            });
        });
      });
    });
  });

  describe('Remove', () => {
    it('it should DELETE a workflow', (done) => {
      const user = new User(USER_DATA);
      user.save((errorUser, savedUser) => {
        const workflow = new Workflow({ name: 'Workflow', user: savedUser });
        workflow.save((errorWorkflow, savedWorkflow) => {
          chai.request(BASE_API_URL)
            .delete(`/api/workflows/${savedWorkflow._id}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.name.should.be.eql('Workflow');
              res.body.user._id.should.be.eql(savedUser._id.toString());
              done();
            });
        });
      });
    });
  });
};

export default workflowsTests;
