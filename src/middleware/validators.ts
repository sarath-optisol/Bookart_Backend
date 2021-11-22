import { check, validationResult } from "express-validator";

const registerValdiator = async (req: any, res: any, next: any) => {
  await check("username", "Username Required").notEmpty().run(req);
  await check("email", "email required").isEmail().run(req),
    await check("password", "Password Required").notEmpty().run(req);
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  } else return next();
};
const loginValidator = async (req: any, res: any, next: any) => {
  await check("username", "username required").notEmpty().run(req),
    await check("password", "Password Required").notEmpty().run(req);
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  } else return next();
};

const bookCreatevalidator = async (req: any, res: any, next: any) => {
  await check("name", " Book name Required").notEmpty().run(req),
    await check("price", " price Required").notEmpty().run(req),
    await check("authorname", " Authorname name Required").notEmpty().run(req),
    await check("publisher", " publisher name Required").notEmpty().run(req),
    await check("image", " image Required").notEmpty().run(req),
    await check("releasedate", " Release date Required").notEmpty().run(req),
    await check("language", " Language Required").notEmpty().run(req),
    await check("description", " Release date Required").notEmpty().run(req),
    await check("quantity", " Enter Number of books in stock")
      .notEmpty()
      .run(req);
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  } else return next();
};

export { bookCreatevalidator, loginValidator, registerValdiator };