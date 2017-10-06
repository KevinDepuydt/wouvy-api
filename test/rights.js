import chai from 'chai';
import chaiHttp from 'chai-http';
import env from '../src/config/env';

// add chaiHttp to chai
chai.use(chaiHttp);

// define base url
const BASE_API_URL = `http://${env.host}:${env.port}`;

// call chai should
chai.should();

const rightsTests = () => {
  describe('List', () => {
    it('it should GET all rights', (done) => {
      chai.request(BASE_API_URL)
        .get('/api/rights')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.be.eql(env.rights);
          done();
        });
    });
  });
};

export default rightsTests;
