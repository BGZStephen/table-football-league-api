import { Request, Response, Router } from "express";
import * as rest from '../../utils/rest';
import { Team } from "../../domain/team/team";

const router = Router();

async function list(req: Request, res: Response): Promise<void> {
  const results = await Team.list(req.query);
  res.json(results);
}

async function create(req: Request, res: Response): Promise<void> {
  const team = await Team.create(req.body);
  res.json(team);
}

router.get('/', rest.asyncwrap(list));
router.post('/', rest.asyncwrap(create));

export const teamRoutes = router;
