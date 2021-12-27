import chai from "chai";
import { server } from "../../server";
import chaiHttp from "chai-http";
import { describe, it } from "mocha";
import "mocha";
import { response } from "express";
import { createAdmintokens } from "../../middleware/jwt";
chai.use(chaiHttp);
chai.should();
let bookId: any;
//Test GET all books
const token = createAdmintokens({ adminId: 1, username: "sarath-admin" });
describe("Test Book API", () => {
  describe("POST /book/create", () => {
    it("It should create a book", (done) => {
      const book = {
        bookId: 1,
        name: "Stoic learnings",
        price: 1000,
        authorname: "aristole",
        publisher: "Penguin",
        image: "https://image.jpg",
        releasedate: "2020-01-01T00:00:00.000Z",
        language: "English",
        description: "fictional book for kids ",
        quantity: 20,
        category: "Life",
        createdAt: "2021-12-07",
        updatedAt: "2021-12-07",
        deletedAt: null,
      };
      chai
        .request(server)
        .post("/book/create")
        .set({ auth: `Bearer ${token}` })
        .send(book)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.has.a("object");
          response.body.should.have.property("name");
          response.body.should.have.property("price");
          response.body.should.have.property("authorname");
          response.body.should.have.property("image");
          response.body.should.have.property("releasedate");
          response.body.should.have.property("language");
          response.body.should.have.property("description");
          response.body.should.have.property("quantity");
          response.body.should.have.property("category");
          bookId = response.body.bookId;
          done();
        });
    });
    it("It should not create a book", (done) => {
      const wrongbook = {
        bookId: 1,
        name: "Stoic learnings",
        price: 1000,
        authorname: "aristole",
        image: "https://image.jpg",
        releasedate: "2020-01-01",
        language: "English",
        description: "fictional book for kids ",
        quantity: 20,
        category: "Life",
        createdAt: "2021-12-07",
        updatedAt: "2021-12-07",
        deletedAt: null,
      };
      chai
        .request(server)
        .post("/book/create")
        .set({ auth: `Bearer ${token}` })
        .send(wrongbook)
        .end((err, response) => {
          response.should.have.status(400);
          done();
        });
    });
  });
  describe("PUT /book/update/:id", () => {
    it("Update a book by id ", (done) => {
      chai
        .request(server)
        .put(`/book/update/${bookId}`)
        .set({ auth: `Bearer ${token}` })
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.has.a("object");
          response.body.should.have.property("name");
          response.body.should.have.property("price");
          response.body.should.have.property("authorname");
          response.body.should.have.property("image");
          response.body.should.have.property("releasedate");
          response.body.should.have.property("language");
          response.body.should.have.property("description");
          response.body.should.have.property("quantity");
          response.body.should.have.property("category");
          response.body.should.be.not.empty;
          done();
        });
    });
  });
  describe("GET /book/all", () => {
    it("It should get all books", (done) => {
      chai
        .request(server)
        .get("/book/all")
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.a("object");
          response.should.be.not.empty;
          response.body.should.be.a("array");
          response.should.be.json;
          done();
        });
    });
    it("It should not get all books", (done) => {
      chai
        .request(server)
        .get("/book/al")
        .end((err, response) => {
          response.should.have.status(404);
          done();
        });
    });
  });
  describe("GET /book/:id ", () => {
    it("It should return book a book by it's id", (done) => {
      chai
        .request(server)
        .get(`/book/searchbyid/${bookId}`)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.have.a("object");
          response.body.should.be.not.empty;
          done();
        });
    });
    it("It should return error book doesnt exist ", (done) => {
      const wrongId = 100;
      chai
        .request(server)
        .get(`/book/searchbyid/${wrongId}`)
        .end((err, response) => {
          response.should.have.status(400);
          response.body.should.has.string("No books found");
          done();
        });
    });
  });
  describe("GET /book/author/:authorname", () => {
    it("It should get books by authorname", (done) => {
      const author = "aristole";
      chai
        .request(server)
        .get(`/book/author/${author}`)
        .end((err, response) => {
          response.body.should.have.a("array");
          response.should.have.status(200);
          done();
        });
    });
    it("It should not get books by authorname", (done) => {
      const author = "auth";
      chai
        .request(server)
        .get(`/book/author/${author}`)
        .end((err, response) => {
          response.should.have.status(400);
          response.body.should.has.string("author not found");
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
