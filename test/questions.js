import chai from 'chai';
import chaiHttp from 'chai-http';
import env from '../src/config/env';
import User from '../src/models/user';
import Question from '../src/models/question';

// add chaiHttp to chai
chai.use(chaiHttp);

// define base url
const BASE_API_URL = `http://${env.host}:${env.port}`;

// call chai should
chai.should();

const questionsTests = () => {
  afterEach((done) => {
    User.remove({}, () => {
      Question.remove({}, () => done());
    });
  });

  describe('List', () => {
    it('it should GET all the questions', (done) => {
      chai.request(BASE_API_URL)
        .get('/api/questions')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  describe('Create', () => {
    it('it should POST a question', (done) => {
      const user = new User({ firstname: 'First', lastname: 'Last', password: 'Password' });
      user.save((error, savedUser) => {
        const questionData = { user: savedUser, question: 'question' };
        chai.request(BASE_API_URL)
          .post('/api/questions')
          .send(questionData)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.user.should.be.eql(savedUser._id.toString());
            res.body.question.should.be.eql('question');
            done();
          });
      });
    });
  });

  describe('Read', () => {
    it('it should GET a question by id', (done) => {
      const user = new User({ firstname: 'First', lastname: 'Last', password: 'Password' });
      user.save((errorUser, savedUser) => {
        const question = new Question({ question: 'question', user: savedUser });
        question.save((errorQuestion, savedQuestion) => {
          chai.request(BASE_API_URL)
            .get(`/api/questions/${savedQuestion._id}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body._id.should.be.eql(savedQuestion._id.toString());
              res.body.user.should.be.eql(savedUser._id.toString());
              res.body.question.should.be.eql('question');
              done();
            });
        });
      });
    });
  });

  describe('Update', () => {
    it('it should PUT a question', (done) => {
      const updates = { question: 'question updated' };
      const user = new User({ firstname: 'First', lastname: 'Last', password: 'Password' });
      user.save((errorUser, savedUser) => {
        const question = new Question({ question: 'question', user: savedUser });
        question.save((errorQuestion, savedQuestion) => {
          chai.request(BASE_API_URL)
            .put(`/api/questions/${savedQuestion._id}`)
            .send(updates)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.user.should.be.eql(savedUser._id.toString());
              res.body.question.should.be.eql('question updated');
              done();
            });
        });
      });
    });
  });

  describe('Remove', () => {
    it('it should DELETE a question', (done) => {
      const user = new User({ firstname: 'First', lastname: 'Last', password: 'Password' });
      user.save((errorUser, savedUser) => {
        const question = new Question({ question: 'question', user: savedUser });
        question.save((errorQuestion, savedQuestion) => {
          chai.request(BASE_API_URL)
            .delete(`/api/questions/${savedQuestion._id}`)
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

export default questionsTests;
