import { Request, Response, Router } from "express";
import * as rest from '../../utils/rest';
import { Game } from "../../domain/game/game";
import { UserService } from "../../domain/user/service";
import { HTTPUnauthorized } from "../../domain/errors/http-error";

const router = Router();

async function list(req: Request, res: Response): Promise<void> {
  const results = await Game.list(req.query);
  res.json(results);
}

async function create(req: Request, res: Response): Promise<void> {
  const game = await Game.create(req.body);
  res.json(game);
}

async function update(req: Request, res: Response): Promise<void> {
  const game = await Game.getById(req.params.id);
  const sessionUser = UserService.get();

  if (!game.hasUser(sessionUser._id)) {
    throw HTTPUnauthorized()
  }
  await game.update(req.body);

  res.json(game.getPublicFields());
}

async function get(req: Request, res: Response): Promise<void> {
  const game = await Game.getById(req.params.id);

  res.json(game.getPublicFields());
}

router.get('/', rest.asyncwrap(list));
router.post('/', rest.asyncwrap(create));
router.get('/:id', rest.asyncwrap(get));
router.put('/:id', rest.asyncwrap(update));

export const gameRoutes = router;
