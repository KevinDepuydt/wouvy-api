import chai from 'chai';
import chaiHttp from 'chai-http';
import env from '../src/config/env';
import * as app from '../src/config/lib/app';
import Document from '../src/models/document';

// add chaiHttp to chai
chai.use(chaiHttp);

// define base url
const BASE_API_URL = `http://${env.host}:${env.port}`;

// call chai should
chai.should();

describe('Documents', () => {
  before((done) => {
    app.start(() => done());
  });

  after(() => {
    process.exit(0);
  });

  afterEach((done) => {
    Document.remove({}, () => done());
  });

  describe('List documents', () => {
    it('it should GET all the books', (done) => {
      chai.request(BASE_API_URL)
        .get('/api/documents')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  describe('Create document', () => {
    it('it should POST a document', (done) => {
      const document = { name: 'DocTest' };
      chai.request(BASE_API_URL)
        .post('/api/documents')
        .send(document)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.name.should.be.eql('DocTest');
          done();
        });
    });

    it('it should not POST a document', (done) => {
      const document = { title: 'DocTest' };
      chai.request(BASE_API_URL)
        .post('/api/documents')
        .send(document)
        .end((err, res) => {
          res.should.not.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.have.property('errors');
          done();
        });
    });
  });

  describe('Get document', () => {
    it('it should GET a document by id', (done) => {
      const document = new Document({ name: 'docTest' });
      document.save((error, savedDoc) => {
        chai.request(BASE_API_URL)
          .get(`/api/documents/${savedDoc._id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.name.should.be.eql('docTest');
            done();
          });
      });
    });
  });

  describe('Update document', () => {
    it('it should PUT a document', (done) => {
      const updates = { name: 'DocTestUpdated' };
      const document = new Document({ name: 'docToDelete' });
      document.save((error, savedDoc) => {
        chai.request(BASE_API_URL)
          .put(`/api/documents/${savedDoc._id}`)
          .send(updates)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.name.should.be.eql('DocTestUpdated');
            done();
          });
      });
    });
  });

  describe('Remove document', () => {
    it('it should DELETE a document', (done) => {
      const document = new Document({ name: 'docToDelete' });
      document.save((error, savedDoc) => {
        chai.request(BASE_API_URL)
          .delete(`/api/documents/${savedDoc._id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.name.should.be.eql('docToDelete');
            done();
          });
      });
    });
  });
});
