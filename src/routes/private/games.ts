import { Request, Response, Router } from "express";
import * as rest from '../../utils/rest';
import { Game } from "../../domain/game/game";

const router = Router();

async function list(req: Request, res: Response): Promise<void> {
  const results = await Game.list(req.query);
  res.json(results);
}

async function create(req: Request, res: Response): Promise<void> {
  const team = await Game.create(req.body);
  res.json(team);
}

router.get('/', rest.asyncwrap(list));
router.post('/', rest.asyncwrap(create));

export const gameRoutes = router;
