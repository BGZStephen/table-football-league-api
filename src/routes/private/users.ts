import { Request, Response, Router } from "express";
import * as rest from '../../utils/rest';
import { User } from "../../domain/user/user";

const router = Router();

async function list(req: Request, res: Response): Promise<void> {
  const results = await User.list(req.query);
  res.json(results);
}

async function get(req: Request, res: Response) {
  const user = await User.getById(req.params.id);
  res.json(user.getPublicFields());
}

async function update(req: Request, res: Response): Promise<void> {
  const user = await User.getById(req.params.id);
  await user.update(req.body);

  res.json(user.getPublicFields());
}

router.get('/', rest.asyncwrap(list));
router.get('/:id', rest.asyncwrap(get));
router.put('/:id', rest.asyncwrap(update));

export const userRoutes = router;
