import { Request, Response, Router } from "express";
import * as rest from '../../utils/rest';
import { Message } from "../../domain/message/message";
import { UserService } from "../../domain/user/service";
import { HTTPUnauthorized } from "../../domain/errors/http-error";

const router = Router();

async function list(req: Request, res: Response): Promise<void> {
  const results = await Message.list(req.query);
  res.json(results);
}

async function create(req: Request, res: Response): Promise<void> {
  const message = await Message.create(req.body);
  res.json(message);
}

async function update(req: Request, res: Response): Promise<void> {
  const message = await Message.getById(req.params.id);
  const sessionUser = UserService.get();

  if (!message.hasUser(sessionUser._id)) {
    throw HTTPUnauthorized()
  }
  await message.update(req.body);

  res.json(message.getPublicFields());
}

async function get(req: Request, res: Response): Promise<void> {
  const message = await Message.getById(req.params.id);

  res.json(message.getPublicFields());
}

router.get('/', rest.asyncwrap(list));
router.post('/', rest.asyncwrap(create));
router.get('/:id', rest.asyncwrap(get));
router.put('/:id', rest.asyncwrap(update));

export const messageRoutes = router;
