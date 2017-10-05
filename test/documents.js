import chai from 'chai';
import chaiHttp from 'chai-http';
import env from '../src/config/env';
import Document from '../src/models/document';

// add chaiHttp to chai
chai.use(chaiHttp);

// define base url
const BASE_API_URL = `http://${env.host}:${env.port}`;

// call chai should
chai.should();

const documentsTests = () => {
  afterEach((done) => {
    Document.remove({}, () => done());
  });

  describe('List', () => {
    it('it should GET all the documents', (done) => {
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

  describe('Create', () => {
    it('it should POST a document', (done) => {
      const document = { name: 'Document' };
      chai.request(BASE_API_URL)
        .post('/api/documents')
        .send(document)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.name.should.be.eql('Document');
          done();
        });
    });
  });

  describe('Read', () => {
    it('it should GET a document by id', (done) => {
      const document = new Document({ name: 'Document' });
      document.save((error, savedDoc) => {
        chai.request(BASE_API_URL)
          .get(`/api/documents/${savedDoc._id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.name.should.be.eql('Document');
            done();
          });
      });
    });
  });

  describe('Update', () => {
    it('it should PUT a document', (done) => {
      const updates = { name: 'DocumentUpdated' };
      const document = new Document({ name: 'Document' });
      document.save((error, savedDoc) => {
        chai.request(BASE_API_URL)
          .put(`/api/documents/${savedDoc._id}`)
          .send(updates)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.name.should.be.eql('DocumentUpdated');
            done();
          });
      });
    });
  });

  describe('Remove', () => {
    it('it should DELETE a document', (done) => {
      const document = new Document({ name: 'Document' });
      document.save((error, savedDoc) => {
        chai.request(BASE_API_URL)
          .delete(`/api/documents/${savedDoc._id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.name.should.be.eql('Document');
            done();
          });
      });
    });
  });
};

export default documentsTests;
