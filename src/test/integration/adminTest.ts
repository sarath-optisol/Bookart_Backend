import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { describe, it } from "mocha";
import { server } from "../../server";
import BookInstance from "../../models/books_model";
import { deleteUserTable, deleteCart } from "./cartTest";
import CartInstance from "../../models/cart";
import UserInstance from "../../models/user";
import AdminInstance from "../../models/admin_model";
import { response } from "express";
chai.use(chaiHttp);
chai.should();
const admin = async () => {
  await AdminInstance.create({
    username: "admin",
    password: "pass123",
    isAdmin: true,
  });
};
let token: string;
const deleteAdmin = async () => {
  await AdminInstance.destroy({
    where: { username: "admin" },
    truncate: true,
    force: true,
  });
};
describe("TEST Admin APIs", () => {
  describe("POST /admin/login", () => {
    before(async function () {
      await deleteAdmin();
      await admin();
    });
    it("Should Login into admin account", (done) => {
      chai
        .request(server)
        .post("/admin/login")
        .send({ username: "admin", password: "pass123" })
        .end((err, response) => {
          response.should.have.status(200);
          response.body.token.should.have.a("string");
          response.body.should.haveOwnProperty("token");
          token = response.body.token;
          done();
        });
    });
    it("Should not Login into admin account using wrong pass", (done) => {
      chai
        .request(server)
        .post("/admin/login")
        .send({ username: "admin", password: "pass=123" })
        .end((err, response) => {
          response.should.have.status(400);
          response.body.err.should.have.a.string("wrong pass");
          done();
        });
    });
    it("Should not Login into admin account using wrong username", (done) => {
      chai
        .request(server)
        .post("/admin/login")
        .send({ username: "admn", password: "pass123" })
        .end((err, response) => {
          response.should.have.status(400);
          response.body.should.have.a.string("Wrong username");
          done();
        });
    });
  });
  describe("GET /admin/dashboard/revenue", () => {
    it("Should get total profit", (done) => {
      const bearertoken = `Bearer ${token}`;
      chai
        .request(server)
        .get("/admin/dashboard/revenue")
        .set({ auth: bearertoken })
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.have.a("number");
          done();
        });
    });
  });
  describe("GET /admin/dashboard/users", () => {
    it("Should get total user count", (done) => {
      const bearertoken = `Bearer ${token}`;
      chai
        .request(server)
        .get("/admin/dashboard/users")
        .set({ auth: bearertoken })
        .end((err, response) => {
          response.should.have.status(200);
          response.body.userCount.should.have.a("number");
          response.body.should.haveOwnProperty("userCount");
          done();
        });
    });
  });
  describe("GET /admin/dashboard/category", () => {
    it("Should get most sold category", (done) => {
      const bearertoken = `Bearer ${token}`;
      chai
        .request(server)
        .get("/admin/dashboard/category")
        .set({ auth: bearertoken })
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.have.a("array");
          done();
        });
    });
  });
  //order admin get
  describe("GET /", () => {});
});
