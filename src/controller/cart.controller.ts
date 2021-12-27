import CartInstance from "../models/cart";
import UserInstance from "../models/user";
import { createBook } from "../test/integration/cartTest";

const addProductToCart = async (req: any, res: any) => {
  const { userId } = req.body.tokenPayload;
  const { bookId, quantity } = req.body;
  try {
    const cart = await CartInstance.findOne({
      where: { userId: userId, bookId: bookId },
    });
    if (cart) {
      await cart.update({ quantity });
      return res.status(200).json("Quantity updated");
    }
    const createcart = await CartInstance.create({
      bookId: bookId,
      quantity: quantity,
      userId: userId,
    });
    return res.status(200).json("Book added to cart");
  } catch (err) {
    res.status(400).json(err);
  }
};

const updateCart = async (req: any, res: any) => {
  const { userId } = req.body.tokenPayload;
  const { bookId, quantity } = req.body;
  try {
    const cart = await CartInstance.findOne({
      where: { userId: userId, bookId: bookId },
    });
    if (cart) {
      await cart.update({ quantity: quantity });
      await cart.save();
      return res.status(200).json("Cart updated");
    }

    return res.status(400).json("There is no such book in cart ");
  } catch (err) {
    res.status(400).json(err);
  }
};

const deleteById = async (req: any, res: any) => {
  const { userId } = req.body.tokenPayload;
  const { id } = req.params;
  try {
    const cart = await CartInstance.findOne({
      where: { userId: userId, bookId: id },
    });
    if (cart) {
      await cart.destroy();
      return res.status(200).json("book removed from cart");
    }
    return res.status(400).json("No such book in user cart");
  } catch (err) {
    res.status(400).json(err);
  }
};

const emptycart = async (req: any, res: any) => {
  const { userId } = req.body.tokenPayload;
  try {
    const cart = await CartInstance.findAll({
      where: {
        userId: userId,
      },
    });
    if (cart.length == 0) {
      return res.status(400).json("cart is already empty");
    }
    const cartdestroy = await CartInstance.destroy({
      where: { userId: userId },
    });
    return res.status(200).json("cart is emptied");
  } catch (err) {
    res.status(400).json(err);
  }
};

const getCart = async (req: any, res: any) => {
  const { userId } = req.body.tokenPayload;

  try {
    const user: any = await UserInstance.findByPk(userId);
    const cart = await user.getBooksInCart();
    let cartproducts: any = [];
    cart.forEach((book: any) => {
      const temp = {
        bookId: book.bookId,
        name: book.name,
        description: book.description,
        price: book.price,
        quantity: book.cart.quantity,
      };
      cartproducts.push(temp);
    });

    res.status(200).json(cartproducts);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

export { getCart, deleteById, emptycart, updateCart, addProductToCart };
