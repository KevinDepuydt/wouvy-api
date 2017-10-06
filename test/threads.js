import chai from 'chai';
import chaiHttp from 'chai-http';
import env from '../src/config/env';
import User from '../src/models/user';
import Thread from '../src/models/thread';
import Message from '../src/models/message';

// add chaiHttp to chai
chai.use(chaiHttp);

// define base url
const BASE_API_URL = `http://${env.host}:${env.port}`;

// call chai should
chai.should();

const USER_DATA = { email: 'test@wouvy.fr', firstname: 'First', lastname: 'Last', password: 'Password' };
const USER_DATA_TWO = { email: 'test2@wouvy.fr', firstname: 'First', lastname: 'Last', password: 'Password' };

const threadsTests = () => {
  afterEach((done) => {
    User.remove({}, () => {
      Thread.remove({}, () => done());
    });
  });

  describe('List', () => {
    it('it should GET all the threads', (done) => {
      chai.request(BASE_API_URL)
        .get('/api/threads')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  describe('Create', () => {
    it('it should POST a thread', (done) => {
      const userOne = new User(USER_DATA);
      const userTwo = new User(USER_DATA_TWO);
      userOne.save((errorUserOne, savedUserOne) => {
        userTwo.save((errorUserTwo, savedUserTwo) => {
          const threadData = {
            users: [savedUserOne, savedUserTwo],
            messages: [
              new Message({ user: savedUserOne, message: 'Coucou' }),
            ],
          };
          chai.request(BASE_API_URL)
            .post('/api/threads')
            .send(threadData)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.users.should.have.lengthOf(2);
              res.body.messages.should.have.lengthOf(1);
              done();
            });
        });
      });
    });
  });

  describe('Read', () => {
    it('it should GET a thread by id', (done) => {
      const userOne = new User(USER_DATA);
      const userTwo = new User(USER_DATA_TWO);
      userOne.save((errorUserOne, savedUserOne) => {
        userTwo.save((errorUserTwo, savedUserTwo) => {
          const thread = new Thread({
            users: [savedUserOne, savedUserTwo],
            messages: [
              new Message({ user: savedUserOne, message: 'Coucou' }),
            ],
          });
          thread.save((errorThread, savedThread) => {
            chai.request(BASE_API_URL)
              .get(`/api/threads/${savedThread._id}`)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.users.should.have.lengthOf(2);
                res.body.messages.should.have.lengthOf(1);
                done();
              });
          });
        });
      });
    });
  });

  describe('Update', () => {
    it('it should PUT a thread', (done) => {
      const userOne = new User(USER_DATA);
      const userTwo = new User(USER_DATA_TWO);
      userOne.save((errorUserOne, savedUserOne) => {
        userTwo.save((errorUserTwo, savedUserTwo) => {
          const updates = { message: new Message({ user: savedUserTwo, message: 'Ca va ?' }) };
          const thread = new Thread({
            users: [savedUserOne, savedUserTwo],
            messages: [
              new Message({ user: savedUserOne, message: 'Coucou' }),
            ],
          });
          thread.save((errorThread, savedThread) => {
            chai.request(BASE_API_URL)
              .put(`/api/threads/${savedThread._id}`)
              .send(updates)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.users.should.have.lengthOf(2);
                res.body.messages.should.have.lengthOf(2);
                done();
              });
          });
        });
      });
    });
  });

  describe('Remove', () => {
    it('it should DELETE a thread', (done) => {
      const userOne = new User(USER_DATA);
      const userTwo = new User(USER_DATA_TWO);
      userOne.save((errorUserOne, savedUserOne) => {
        userTwo.save((errorUserTwo, savedUserTwo) => {
          const thread = new Thread({
            users: [savedUserOne, savedUserTwo],
            messages: [
              new Message({ user: savedUserOne, message: 'Coucou' }),
            ],
          });
          thread.save((errorThread, savedThread) => {
            chai.request(BASE_API_URL)
              .delete(`/api/threads/${savedThread._id}`)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.users.should.have.lengthOf(2);
                res.body.messages.should.have.lengthOf(1);
                done();
              });
          });
        });
      });
    });
  });
};

export default threadsTests;
