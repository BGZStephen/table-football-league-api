import { Request, Response, Router } from "express";
import * as rest from '../../utils/rest';

const router = Router();

async function list(req: Request, res: Response): Promise<void> {
  res.json({
    count: 20,
    totalCount: 200,
    data: [{
      _id: 1,
    }]
  });
}

router.get('/', rest.asyncwrap(list));

export const teamRoutes = router;
