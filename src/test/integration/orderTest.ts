import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { describe, it } from "mocha";
import { server } from "../../server";
chai.use(chaiHttp);
import BookInstance from "../../models/books_model";
chai.should();
import { deleteUserTable, deleteCart } from "./cartTest";
import CartInstance from "../../models/cart";
import UserInstance from "../../models/user";
import { response } from "express";
let userid: any, token: any, orderId: any, cart;
let bookid: number[] = [];
const user = {
  username: "order",
  password: "pass123",
  email: "test@gmail.com",
};
let cartid: any;
const registeruser = async (user: any) => {
  await chai.request(server).post("/user/register").send(user);
  const val: any = await UserInstance.update(
    { confirmed: true, address: "this is address" },
    { where: { username: user.username } }
  );
  const find: any = await UserInstance.findOne({
    where: { username: user.username },
  });
  userid = find.userId;
  const response = await chai
    .request(server)
    .post("/user/login")
    .send({ username: user.username, password: user.password });
  token = response.body.token;
};
const addtocart = async (bookid: any) => {
  const cart = await CartInstance.create({
    userId: userid,
    bookId: bookid,
    quantity: 5,
  });
};
const createBook = async (name: string) => {
  const book: any = await BookInstance.create({
    name: `${name}`,
    price: 500,
    authorname: "aristole",
    publisher: "Penguin",
    image: "https://image.jpg",
    releasedate: "2020-01-01",
    language: "English",
    description: "This is a book",
    quantity: 1000,
    category: "life",
  });

  bookid.push(book.bookId);
};

describe("TEST orders API", () => {
  describe("POST /orders/create", () => {
    before(async function () {
      await deleteUserTable();
      await registeruser(user);
      await createBook("book1");
      await createBook("book2");
      await addtocart(bookid[0]);
    });
    it("Should create order", (done) => {
      const bearerToken = `Bearer ${token}`;
      chai
        .request(server)
        .post("/orders/create")
        .set({ auth: bearerToken })
        .send({
          books: [
            { bookId: bookid[0], quantity: 2 },
            { bookId: bookid[1], quantity: 2 },
          ],
        })
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          orderId = response.body.ordersId;
          done();
        });
    });
  });
  describe("GET /orders/user", () => {
    it("should get all orders by user", (done) => {
      const bearerToken = `Bearer ${token}`;
      chai
        .request(server)
        .get("/orders/user")
        .set({ auth: bearerToken })
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("array");
          done();
        });
    });
  });
  describe("GET /orders/user/:id", () => {
    it("should get products in a specific order", (done) => {
      const bearerToken = `Bearer ${token}`;
      chai
        .request(server)
        .get(`/orders/user/${orderId}`)
        .set({ auth: bearerToken })
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("array");
          done();
        });
    });
  });
  describe("POST /orders/cart", () => {
    it("should create order from products in cart", (done) => {
      const bearerToken = `Bearer ${token}`;
      chai
        .request(server)
        .post("/orders/cart")
        .set({ auth: bearerToken })
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          cartid = response.body.ordersId;
          done();
        });
    });
  });
  describe("/orders/payment/:id", () => {
    it("Should pay order", (done) => {
      const bearerToken = `Bearer ${token}`;
      chai
        .request(server)
        .post(`/orders/payment/${orderId}`)
        .set({ auth: bearerToken })
        .send({
          card: {
            cvc: "123",
            number: "4242424242424242",
            address_country: "IN",
            exp_month: 8,
            exp_year: 2022,
          },
        })
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a.string("Payment Sucess");
          done();
        });
    });
  });
  describe("DELETE /orders/delete/:id", () => {
    it("Should delete order by id ", (done) => {
      const bearerToken = `Bearer ${token}`;
      chai
        .request(server)
        .delete(`/orders/delete/${cartid}`)
        .set({ auth: bearerToken })
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a.string("order cancelled");
          done();
        });
    });
    it("should not delete a non exist order ", (done) => {
      const bearerToken = `Bearer ${token}`;
      chai
        .request(server)
        .delete(`/orders/delete/${cartid}`)
        .set({ auth: bearerToken })
        .end((err, response) => {
          response.should.have.status(400);
          response.body.should.be.a.string("order doesnt exist");
          done();
        });
    });
  });
});
