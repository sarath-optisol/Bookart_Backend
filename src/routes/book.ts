import express from "express";
import { check, validationResult } from "express-validator";
import db from "../database/Connection";
import BookInstance from "../models/books_model";
import cookieParser from "cookie-parser";
const { validateTokens, adminvalidate } = require("./jwt");
import Sequelize from "sequelize";
const Op = Sequelize.Op;
const app = express();
app.listen(3001, () => {
  console.log("Listening to port 3001");
});
app.use(express.json());
app.use(cookieParser());

db.sync().then(() => {
  console.log("DB connected");
});
app.post(
  "/book/create",
  [validateTokens, adminvalidate],
  check("name", " Book name Required").notEmpty(),
  check("price", " price Required").notEmpty(),
  check("authorname", " Authorname name Required").notEmpty(),
  check("publisher", " publisher name Required").notEmpty(),
  check("image", " image Required").notEmpty(),
  check("releasedate", " Release date Required").notEmpty(),
  check("language", " Language Required").notEmpty(),
  check("description", " Release date Required").notEmpty(),
  check("noofbooks", " Number of books in stock").notEmpty(),

  async (req: any, res: any) => {
    const {
      name,
      price,
      authorname,
      publisher,
      image,
      releasedate,
      language,
      description,
      noofbooks,
    } = req.body;

    try {
      const validationresult = validationResult(req);
      if (!validationresult.isEmpty()) {
        res.status(400).json(validationresult.array());
        return;
      }
      const booknameCheck = await BookInstance.findAll({
        where: { name: name },
      });
      if (booknameCheck.length > 0) {
        res.status(400).json({ err: "bookname already exist" });
        return;
      }
      BookInstance.create({
        name: name,
        price: price,
        authorname: authorname,
        publisher: publisher,
        image: image,
        releasedate: releasedate,
        language: language,
        description: description,
        noofbooks: noofbooks,
      }).then(() => {
        res.status(200).json("book created");
      });
    } catch (err) {
      console.log(err);
    }
  }
);
app.put(
  "/book/update/:id",
  [validateTokens, adminvalidate],
  async (req: any, res: any) => {
    const bookid = req.params.id;

    try {
      const book = await BookInstance.findByPk(bookid);
      if (!book) {
        res.status(400).json("No books found");
        return;
      } else {
        const updated = await book.update(req.body);
        res.status(200).json(updated);
      }
    } catch (err) {
      res.status(400).json({ error: err });
    }
  }
);

app.get("/books", async (req: any, res: any) => {
  try {
    const book = await BookInstance.findAll();
    res.status(200).json(book);
  } catch (err) {
    res.status(400).json(err);
  }
});

app.get("/book/searchbyid/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const getbook = await BookInstance.findByPk(id);
    res.status(200).json(getbook);
  } catch (err) {
    res.status(400).json(err);
  }
});

app.get("/book/search", async (req: any, res: any) => {
  try {
    const { term } = req.query;
    await BookInstance.findAll({
      where: { name: { [Op.like]: "%" + term + "%" } },
    }).then((val) => {
      if (val.length) {
        res.status(200).json(val);
      } else {
        res.status(200).json("No results");
      }
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

app.delete(
  "/book/delete/:id",
  [validateTokens, adminvalidate],
  async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const deletebook = await BookInstance.findByPk(id);
      deletebook
        ?.destroy()
        .then((val) => {
          res.status(200).json(val);
        })
        .catch((er) => {
          res.status(400).json(er);
        });
    } catch (err) {
      console.log(err);
    }
  }
);

app.get("/book/author/:authorname", async (req: any, res: any) => {
  try {
    const { authorname } = req.params;
    const booksbyauthor = await BookInstance.findAll({
      where: { authorname: authorname },
    });
    if (booksbyauthor.length) {
      res.status(200).json(booksbyauthor);
      return;
    } else {
      res.status(200).json("author not found");

      return;
    }
  } catch (err) {
    console.log(err);
  }
});
