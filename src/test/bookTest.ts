import chai from "chai";
const server = require("../server");
import chaiHttp from "chai-http";
import { describe, it } from "mocha";
import "mocha";
chai.use(chaiHttp);
chai.should();
//Test GET all books

describe("Test Book API", () => {
  describe("GET /book/search", () => {
    it("It should get all books", (done) => {
      chai
        .request(server)
        .get("/book/search")
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.a("object");
          response.should.be.not.empty;
          done();
        });
    });
  });
});

// Test POST Create Book
//Test PUT Update book by id
//Test GET book by authorname
//Test DELETE book by id
//Test GET book by id
//Test GET search by book name
