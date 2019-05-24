import { Request, Response, Router } from "express";
import * as rest from '../../utils/rest';
import { Team } from "../../domain/team/team";

const router = Router();

async function list(req: Request, res: Response): Promise<void> {
  const results = await Team.list(req.query);
  res.json(results);
}

router.get('/', rest.asyncwrap(list));

export const teamRoutes = router;
