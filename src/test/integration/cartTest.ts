import chai, { expect } from "chai";
import { server } from "../../server";
import chaiHttp from "chai-http";
import { describe, it } from "mocha";
import "mocha";
import { response } from "express";
import { createAdmintokens } from "../../middleware/jwt";
import db from "../../database/Connection";
import UserInstance from "../../models/user";
import BookInstance from "../../models/books_model";
import CartInstance from "../../models/cart";
chai.use(chaiHttp);
chai.should();
let bookid: any, userid: any, token: any;
const user = {
  username: "cart",
  password: "pass123",
  email: "test@gmail.com",
};
const deleteUserTable = async () => {
  await UserInstance.destroy({ truncate: true, where: {}, force: true });
  await BookInstance.destroy({ truncate: true, where: {}, force: true });
};
const registeruser = async (user: any) => {
  await chai.request(server).post("/user/register").send(user);
  const val: any = await UserInstance.update(
    { confirmed: true },
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

  bookid = book.bookId;
};
const deleteCart = async () => {
  await CartInstance.destroy({
    truncate: true,
    where: { userId: userid },
    force: true,
  });
};
const addtocart = async () => {
  await CartInstance.create({ userId: userid, bookId: bookid, quantity: 5 });
};
describe("TEST Cart API", () => {
  describe("POST /cart/create", () => {
    before(async function () {
      await deleteUserTable();
      await registeruser(user);
      await deleteCart();
      await createBook("book1");
      await addtocart();
      await createBook("book2");
    });
    //one book is only added to cart
    it("should return cart ", (done) => {
      const bearertoken = `Bearer ${token}`;
      const cart = { bookId: bookid, quantity: 2 };
      chai
        .request(server)
        .post("/cart/create")
        .set({ auth: bearertoken })

        .send(cart)
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(200);
          response.body.should.have.string("Book added to cart");
          done();
        });
    });
    it("should update quantity when called in create route", (done) => {
      const bearertoken = `Bearer ${token}`;
      const cart = { bookId: bookid, quantity: 2 };
      chai
        .request(server)
        .post("/cart/create")
        .set({ auth: bearertoken })
        .send(cart)
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(200);
          response.body.should.have.string("Quantity updated");
          done();
        });
    });
    it("should show error asking for book id", (done) => {
      const bearertoken = `Bearer ${token}`;
      const cart = { quantity: 2 };
      chai
        .request(server)
        .post("/cart/create")
        .set({ auth: bearertoken })
        .send(cart)
        .end((err, response) => {
          response.should.have.status(400);
          expect(response.body.errors[0].msg).equals("book id required");
          done();
        });
    });
    it("should show error asking for quantity", (done) => {
      const bearertoken = `Bearer ${token}`;
      const cart = { bookId: bookid };
      chai
        .request(server)
        .post("/cart/create")
        .set({ auth: bearertoken })
        .send(cart)
        .end((err, response) => {
          response.should.have.status(400);
          expect(response.body.errors[0].msg).equals("quantity required");
          done();
        });
    });
  });
  describe("PUT /cart/update", () => {
    it("Should update the quantity of a product in cart", (done) => {
      const cart = { bookId: bookid, quantity: 4 };
      const bearertoken = `Bearer ${token}`;
      chai
        .request(server)
        .put("/cart/update")
        .set({ auth: bearertoken })
        .send(cart)
        .end((err, response) => {
          response.should.have.status(200);
          expect(response.body).equals("Cart updated");
          done();
        });
    });
    it("should show error asking for book id", (done) => {
      const bearertoken = `Bearer ${token}`;
      const cart = { quantity: 2 };
      chai
        .request(server)
        .put("/cart/update")
        .set({ auth: bearertoken })
        .send(cart)
        .end((err, response) => {
          response.should.have.status(400);
          expect(response.body.errors[0].msg).equals("book id required");
          done();
        });
    });
    it("should show error asking for quantity", (done) => {
      const bearertoken = `Bearer ${token}`;
      const cart = { bookId: bookid };
      chai
        .request(server)
        .put("/cart/update")
        .set({ auth: bearertoken })
        .send(cart)
        .end((err, response) => {
          response.should.have.status(400);
          expect(response.body.errors[0].msg).equals("quantity required");
          done();
        });
    });
  });
  describe("DELETE /cart/delete/:id", () => {
    it("Should delete a product in user cart", (done) => {
      const bearertoken = `Bearer ${token}`;
      chai
        .request(server)
        .delete(`/cart/delete/${bookid}`)
        .set({ auth: bearertoken })
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(200);
          expect(response.body).equals("book removed from cart");
          done();
        });
    });
    it("Should show there no such product in that id", (done) => {
      const bearertoken = `Bearer ${token}`;
      chai
        .request(server)
        .delete(`/cart/delete/${bookid}`)
        .set({ auth: bearertoken })
        .end((err, response) => {
          response.should.have.status(400);
          expect(response.body).equals("No such book in user cart");
          done();
        });
    });
  });
  describe("GET /cart", () => {
    it("Should get all products in cart", (done) => {
      const bearertoken = `Bearer ${token}`;
      chai
        .request(server)
        .get("/cart")
        .set({ auth: bearertoken })
        .end((err, response) => {
          response.should.have.status(200);
          expect(response.body).a("array");
          done();
        });
    });
  });
  describe("DELETE /cart/deleteall", () => {
    it("Should empty cart", (done) => {
      const bearertoken = `Bearer ${token}`;
      chai
        .request(server)
        .delete("/cart/deleteall")
        .set({ auth: bearertoken })
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(200);
          expect(response.body).equals("cart is emptied");
          done();
        });
    });
    it("Should show  cart is already emptied", async () => {
      const bearertoken = `Bearer ${token}`;
      const response = await chai
        .request(server)
        .delete("/cart/deleteall")
        .set({ auth: bearertoken });

      console.log(response.body);
      response.should.have.status(400);
      expect(response.body).equals("cart is already empty");
    });
  });
});

export { deleteUserTable, registeruser, createBook, addtocart, deleteCart };
