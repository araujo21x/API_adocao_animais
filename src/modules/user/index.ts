import { Router, Response, Request } from 'express';

const router = Router();

router.route('/user')
  .get(async (req: Request, res: Response) => {
    res.send('ola mundo');
  });

export default router;
