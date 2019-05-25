import { Request, Response, Router } from "express";
import * as rest from '../../utils/rest';
import { User } from "../../domain/user/user";

const router = Router();

async function list(req: Request, res: Response): Promise<void> {
  const results = await User.list(req.query);
  res.json(results);
}

router.get('/', rest.asyncwrap(list));

export const userRoutes = router;
