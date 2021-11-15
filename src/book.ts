import express from "express";
import { check, validationResult } from "express-validator";
import db from "./database/Connection";
import BookInstance from "./models/books_model";
const app = express();
app.listen(3001, () => {
  console.log("Listening to port 3001");
});
app.use(express.json());
db.sync().then(() => {
  console.log("DB connected");
});

app.post(
  "/book/create",
  check("name", " Book name Required").notEmpty(),
  check("price", " price Required").notEmpty(),
  check("authorname", " Authorname name Required").notEmpty(),
  check("publisher", " publisher name Required").notEmpty(),
  check("image", " image Required").notEmpty(),
  check("releasedate", " Release date Required").notEmpty(),
  check("language", " Language Required").notEmpty(),
  check("description", " Release date Required").notEmpty(),
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
    } = req.body;

    try {
      const validationresult = validationResult(req);
      if (!validationresult.isEmpty()) {
        res.status(400).json(validationresult.array());
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
      }).then(() => {
        res.status(200).json("book created");
      });
    } catch (err) {
      console.log(err);
    }
  }
);
app.put("book/update/:name", (req: any, res: any) => {
  const bookname = req.params.name;
  const {
    name,
    price,
    authorname,
    publisher,
    image,
    releasedate,
    language,
    description,
  } = req.body;
});
