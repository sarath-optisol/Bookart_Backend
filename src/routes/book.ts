import {
  createBook,
  updateBook,
  deleteBook,
  getAllBooks,
  getBookByAuthor,
  searchBook,
  searchBookById,
} from "../controller/books.controller";
import { bookCreatevalidator } from "../middleware/validators";
import { validateTokens, adminvalidate } from "../middleware/validateTokens";
import express from "express";
const router = express.Router();
router.post(
  "/book/create",
  [validateTokens, adminvalidate],
  bookCreatevalidator,
  createBook
);
router.put("/book/update/:id", [validateTokens, adminvalidate], updateBook);
router.get("/book/all", getAllBooks);
router.delete("/book/delete/:id", [validateTokens, adminvalidate], deleteBook);
router.get("/book/searchbyid/:id", searchBookById);
router.get("/book/search", searchBook);
router.get("/book/author/:authorname", getBookByAuthor);

export { router as bookRouter };
