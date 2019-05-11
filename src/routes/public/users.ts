import { Request, Response, Router } from "express";
import * as rest from '../../utils/rest';
import { User } from "../../domain/user/user";

const router = Router();

async function create(req: Request, res: Response): Promise<void> {
  const user = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  })

  const token = user.generateJwt();

  res.json({
    token: token,
    user: user.getPublicFields(),
  });
}

async function authenticate(req: Request, res: Response): Promise<void> {
  const {email, password} = req.body;
  const user = await User.authenticate({email, password});
  const token = user.generateJwt();

  res.json({
    token: token,
    user: user.getPublicFields(),
  });
}

router.post('/', rest.asyncwrap(create));
router.post('/authenticate', rest.asyncwrap(authenticate));

export const userRoutes = router;
