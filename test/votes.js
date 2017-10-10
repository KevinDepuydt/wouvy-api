import chai from 'chai';
import chaiHttp from 'chai-http';
import env from '../src/config/env';
import Vote from '../src/models/vote';

// add chaiHttp to chai
chai.use(chaiHttp);

// define base url
const BASE_API_URL = `http://${env.host}:${env.port}`;

// vote data
const VOTE_DATA = { question: 'Vote', answers: [{ text: 'A' }, { text: 'B' }] };

// call chai should
chai.should();

const votesTests = () => {
  afterEach((done) => {
    Vote.remove({}, () => done());
  });

  describe('List', () => {
    it('it should GET all the votes', (done) => {
      chai.request(BASE_API_URL)
        .get('/api/votes')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  describe('Create', () => {
    it('it should POST a vote', (done) => {
      chai.request(BASE_API_URL)
        .post('/api/votes')
        .send(VOTE_DATA)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.question.should.be.eql('Vote');
          res.body.answers.length.should.be.eql(2);
          done();
        });
    });
  });

  describe('Read', () => {
    it('it should GET a vote by id', (done) => {
      const vote = new Vote(VOTE_DATA);
      vote.save((error, savedVote) => {
        chai.request(BASE_API_URL)
          .get(`/api/votes/${savedVote._id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.question.should.be.eql('Vote');
            res.body.answers.length.should.be.eql(2);
            done();
          });
      });
    });
  });

  describe('Update', () => {
    it('it should PUT a vote', (done) => {
      const updates = { question: 'VoteUpdated' };
      const vote = new Vote(VOTE_DATA);
      vote.save((error, savedVote) => {
        chai.request(BASE_API_URL)
          .put(`/api/votes/${savedVote._id}`)
          .send(updates)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.question.should.be.eql('VoteUpdated');
            res.body.answers.length.should.be.eql(2);
            done();
          });
      });
    });
  });

  describe('Remove', () => {
    it('it should DELETE a vote', (done) => {
      const vote = new Vote(VOTE_DATA);
      vote.save((error, savedVote) => {
        chai.request(BASE_API_URL)
          .delete(`/api/votes/${savedVote._id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.question.should.be.eql('Vote');
            done();
          });
      });
    });
  });
};

export default votesTests;
