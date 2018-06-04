const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const server = require("./app.js");
chai.use(chaiHttp);

it('should return anagrams of "taco"', function(done) {
  chai
    .request(server)
    .post("/search")
    .send({word: "taco"})
    .end(function(err, res) {
      res.should.be.json;
      res.body.should.be.a("array");
      res.body.should.deep.equal(["atoc", "coat", "octa"]);
      done();
    });
});

it('should return anagrams of "o no"', function(done) {
  chai
    .request(server)
    .get("/find")
    .send({word: "o no"})
    .end(function(err, res) {
      res.should.be.json;
      res.body.should.be.a("array");
      res.body.should.deep.equal(["noo", "ono", "oon"]);
      done();
    });
});

it('should return true when comparing "e last" and "slate"', function(done) {
  chai
    .request(server)
    .get("/compare")
    .send({word1: "e last", word2: "slate"})
    .end(function(err, res) {
      res.should.be.json;
      res.body.should.be.a("boolean");
      res.body.should.deep.equal(true);
      done();
    });
});

it('should return the 3 longest anagrams in the dictionary', function(done) {
  chai
    .request(server)
    .get("/find-longest")
    .end(function(err, res) {
      res.should.be.json;
      res.body.should.be.a("array");
      res.body.should.deep.equal([
        "ethylenediaminetetraacetates",
        "electroencephalographically",
        "ethylenediaminetetraacetate"
      ]);
      done();
    });
});
