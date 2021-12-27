import chai, { expect } from "chai";
import { server } from "../../server";
import chaiHttp from "chai-http";
import { describe, it } from "mocha";
import "mocha";
import { response } from "express";
import { createAdmintokens } from "../../middleware/jwt";
import db from "../../database/Connection";
import UserInstance from "../../models/user";
chai.use(chaiHttp);
chai.should();
let name: any;
let token: any;
const deleteUserTable = async () => {
  await UserInstance.destroy({ truncate: true, where: {}, force: true });
};
const notConfirmed = async (name: any) => {
  const user = await UserInstance.findOne({ where: { username: name } });
  await user?.update({ confirmed: false });
};
const confirmed = async (name: any) => {
  const user = await UserInstance.findOne({ where: { username: name } });
  await user?.update({ confirmed: true });
};
const email = "spammaster@yopmail.com";
describe("Test User API", () => {
  describe("POST /user/register", () => {
    before(deleteUserTable);
    it("Should create a user", async () => {
      const user = {
        username: "test",
        email: `${email}`,
        password: "pass123",
      };
      const response = await chai
        .request(server)
        .post("/user/register")
        .send(user);
      expect(response.status).equals(200);
      name = user.username;
      expect(response.body).equals("USER REGISTERED");
    }).timeout(10000);
  });
  it("should ask for username", async () => {
    const user = {
      email: `${email}`,
      password: "pass123",
    };
    const response = await chai
      .request(server)
      .post("/user/register")
      .send(user);
    expect(response.status).equals(400);
    expect(response.body.errors[0].msg).equals("Username Required");
  });
  it("should ask for email", async () => {
    const user = {
      username: "test",
      password: "pass123",
    };
    const response = await chai
      .request(server)
      .post("/user/register")
      .send(user);
    expect(response.status).equals(400);
    expect(response.body.errors[0].msg).equals("email required");
  });
  it("should ask for password", async () => {
    const user = {
      username: "test",
      email: `${email}`,
    };
    const response = await chai
      .request(server)
      .post("/user/register")
      .send(user);
    expect(response.status).equals(400);
    expect(response.body.errors[0].msg).equals("Password Required");
  });
  describe("POST /user/login", () => {
    const call = () => confirmed(name);
    before(call);
    it("Should login the user", (done) => {
      const login = { username: "test", password: "pass123" };
      chai
        .request(server)
        .post("/user/login")
        .send(login)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.have.property("token");
          token = response.body.token;
          done();
        });
    });
    it("Should ask for username", (done) => {
      const login = { password: "pass123" };
      chai
        .request(server)
        .post("/user/login")
        .send(login)
        .end((err, response) => {
          response.should.have.status(400);
          expect(response.body.errors[0].msg).equals("username required");
          done();
        });
    });
    it("Should ask for password", (done) => {
      const login = { username: "test" };
      chai
        .request(server)
        .post("/user/login")
        .send(login)
        .end((err, response) => {
          response.should.have.status(400);
          expect(response.body.errors[0].msg).equals("Password Required");
          done();
        });
    });
    it("should not login and show wrong pass", (done) => {
      const login = { username: "test", password: "wrongpass" };
      chai
        .request(server)
        .post("/user/login")
        .send(login)
        .end((err, response) => {
          response.should.have.status(400);
          expect(response.body.error).equals("Wrong pass");
          done();
        });
    });
  });
  describe("PUT /user/address", () => {
    it("Should update user address", (done) => {
      const bearertoken = `Bearer ${token}`;
      const address = { address: "this is a address" };
      chai
        .request(server)
        .put("/user/address")
        .set({ auth: bearertoken })
        .send(address)
        .end((err, response) => {
          response.should.have.status(200);
          expect(response.body.address).equals(address.address);
          done();
        });
    });
    it("Should ask to  login to update address", (done) => {
      const address = { address: "this is a address" };
      chai
        .request(server)
        .put("/user/address")
        .send(address)
        .end((err, response) => {
          response.should.have.status(400);
          expect(response.body.err).equals("please login first");
          done();
        });
    });
    it("Should ask enter address", (done) => {
      const bearertoken = `Bearer ${token}`;

      chai
        .request(server)
        .put("/user/address")
        .send()
        .set({ auth: bearertoken })
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(400);
          expect(response.body).equals("Send address");
          done();
        });
    });
    describe("PUT /user/mobile", () => {
      it("should update mobile number", (done) => {
        const bearertoken = `Bearer ${token}`;
        const mobile = { mobile: 8056282911 };
        chai
          .request(server)
          .put("/user/mobile")
          .set({ auth: bearertoken })
          .send(mobile)
          .end((err, response) => {
            response.should.have.status(200);
            expect(response.body.mobile).equals(mobile.mobile);
            done();
          });
      });
      it("should not update mobile number", (done) => {
        const bearertoken = `Bearer ${token}`;
        const mobile = { mobile: 805628291 };
        chai
          .request(server)
          .put("/user/mobile")
          .set({ auth: bearertoken })
          .send(mobile)
          .end((err, response) => {
            response.should.have.status(400);
            expect(response.body).equals(
              "mobile number should have only 10 number"
            );
            done();
          });
      });
      it("should ask for valid indian number", (done) => {
        const bearertoken = `Bearer ${token}`;
        const mobile = { mobile: 2056282910 };
        chai
          .request(server)
          .put("/user/mobile")
          .set({ auth: bearertoken })
          .send(mobile)
          .end((err, response) => {
            response.should.have.status(400);
            expect(response.body).equals("Enter mobile valid number");
            done();
          });
      });
    });
    describe("PUT /user/password", () => {
      it("Should change user password", (done) => {
        const bearertoken = `Bearer ${token}`;
        const password = { oldPassword: "pass123", newPassword: "pass321" };
        chai
          .request(server)
          .put("/user/password")
          .set({ auth: bearertoken })
          .send(password)
          .end((err, response) => {
            response.should.have.status(200);
            expect(response.body).equals("password updated");
            done();
          });
      });
      it("Should say wrong old password", (done) => {
        const bearertoken = `Bearer ${token}`;
        const password = { oldPassword: "pass23", newPassword: "pass123" };
        chai
          .request(server)
          .put("/user/password")
          .set({ auth: bearertoken })
          .send(password)
          .end((err, response) => {
            console.log(response.body);
            response.should.have.status(400);
            expect(response.body).equals("Wrong pass");
            done();
          });
      });
      it("Should ask for old password", (done) => {
        const bearertoken = `Bearer ${token}`;
        const password = { newPassword: "pass123" };
        chai
          .request(server)
          .put("/user/password")
          .set({ auth: bearertoken })
          .send(password)
          .end((err, response) => {
            response.should.have.status(400);
            expect(response.body.errors[0].msg).equals("old Password Required");
            done();
          });
      });
      it("Should ask for new password", (done) => {
        const bearertoken = `Bearer ${token}`;
        const password = { oldPassword: "pass123" };
        chai
          .request(server)
          .put("/user/password")
          .set({ auth: bearertoken })
          .send(password)
          .end((err, response) => {
            response.should.have.status(400);
            expect(response.body.errors[0].msg).equals("new Password Required");
            done();
          });
      });
    });
    describe("POST /user/forgot-password", () => {
      it("Should send email to change password", (done) => {
        chai
          .request(server)
          .post("/user/forgot-password")
          .send({ email: email })
          .end((err, response) => {
            response.should.have.status(200);
            expect(response.body).equals(
              "Link to change password is sent to your mail"
            );
            done();
          });
      });
      it("Should say email id doesnt exist", (done) => {
        chai
          .request(server)
          .post("/user/forgot-password")
          .send({ email: "email" })
          .end((err, response) => {
            response.should.have.status(400);
            expect(response.body).equals("Email id doesnt exist");
            done();
          });
      });
    });
  });
});
