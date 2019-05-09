import { Request, Response, Router } from "express";
import * as jwt from '../../utils/jwt';
import * as validate from 'validate.js';
import * as rest from '../../utils/rest';
import { UserModel } from "../../models/user";

const router = Router();

async function create(req: Request, res: Response): Promise<void> {
  const validatorErrors = validate(req.body, {
    email: {presence: {message: 'Email address is required'}},
    firstName: {presence: {message: 'First name is required'}},
    lastName: {presence: {message: 'Last name is required'}},
    password: {presence: {message: 'Email address is required'}}
  }, {format: "flat"})

  if (validatorErrors) {
    return res.error({message: validatorErrors, statusCode: 403});
  }

  const existingUser = await UserModel.findOne({email: req.body.email})

  if (existingUser) {
    return res.error({message: 'Email address already in use', statusCode: 400});
  }

  const user = await UserModel.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  })

  const token = jwt.generateUserToken(user);

  res.json({
    token: token,
    user: {
      _id: user._id,
    }
  });
}

router.post('/', rest.asyncwrap(create));

module.exports = {
  router,
  __create: create,
}
