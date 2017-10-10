import chai from 'chai';
import chaiHttp from 'chai-http';
import env from '../src/config/env';
import Task from '../src/models/task';

// add chaiHttp to chai
chai.use(chaiHttp);

// define base url
const BASE_API_URL = `http://${env.host}:${env.port}`;

// call chai should
chai.should();

const tasksTests = () => {
  afterEach((done) => {
    Task.remove({}, () => done());
  });

  describe('List', () => {
    it('it should GET all tasks', (done) => {
      chai.request(BASE_API_URL)
        .get('/api/tasks')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  describe('Create', () => {
    it('it should POST a task', (done) => {
      const taskData = { title: 'Task' };
      chai.request(BASE_API_URL)
        .post('/api/tasks')
        .send(taskData)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.title.should.be.eql('Task');
          res.body.description.should.be.eql('');
          res.body.isDone.should.be.eql(false);
          done();
        });
    });
  });

  describe('Read', () => {
    it('it should GET a task by id', (done) => {
      const task = new Task({ title: 'Task', description: 'task description' });
      task.save((error, savedTask) => {
        chai.request(BASE_API_URL)
          .get(`/api/tasks/${savedTask._id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.title.should.be.eql('Task');
            res.body.description.should.be.eql('task description');
            res.body.isDone.should.be.eql(false);
            done();
          });
      });
    });
  });

  describe('Update', () => {
    it('it should PUT a task', (done) => {
      const updates = { isDone: true };
      const task = new Task({ title: 'Task' });
      task.save((error, savedTask) => {
        chai.request(BASE_API_URL)
          .put(`/api/tasks/${savedTask._id}`)
          .send(updates)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.title.should.be.eql('Task');
            res.body.isDone.should.be.eql(true);
            done();
          });
      });
    });
  });

  describe('Remove', () => {
    it('it should DELETE a task', (done) => {
      const task = new Task({ title: 'Task', description: 'task description' });
      task.save((error, savedTask) => {
        chai.request(BASE_API_URL)
          .delete(`/api/tasks/${savedTask._id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.title.should.be.eql('Task');
            res.body.description.should.be.eql('task description');
            res.body.isDone.should.be.eql(false);
            done();
          });
      });
    });
  });
};

export default tasksTests;
