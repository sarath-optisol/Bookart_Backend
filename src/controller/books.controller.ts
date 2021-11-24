import BookInstance from "../models/books_model";
import { Op } from "sequelize";
import { validationResult } from "express-validator";
const createBook = async (req: any, res: any) => {
  const {
    name,
    price,
    authorname,
    publisher,
    image,
    releasedate,
    language,
    description,
    quantity,
    category,
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
      quantity: quantity,
      category: category,
    }).then(() => {
      res.status(200).json("book created");
    });
  } catch (err) {
    console.log(err);
  }
};

const updateBook = async (req: any, res: any) => {
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
};

const getAllBooks = async (req: any, res: any) => {
  try {
    const book = await BookInstance.findAll();
    res.status(200).json(book);
  } catch (err) {
    res.status(400).json(err);
  }
};

const searchBookById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const getbook = await BookInstance.findByPk(id);
    res.status(200).json(getbook);
  } catch (err) {
    res.status(400).json(err);
  }
};
const searchBook = async (req: any, res: any) => {
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
};

const deleteBook = async (req: any, res: any) => {
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
};

const getBookByAuthor = async (req: any, res: any) => {
  try {
    const { authorname } = req.params;
    const authorName = authorname.replace("-", " ");
    const booksbyauthor = await BookInstance.findAll({
      where: { authorname: authorName },
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
};

export {
  createBook,
  updateBook,
  deleteBook,
  getAllBooks,
  getBookByAuthor,
  searchBook,
  searchBookById,
};
