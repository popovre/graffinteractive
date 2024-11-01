import { Request, Response, NextFunction } from 'express';
import { slides } from './mock';
import { reply, getByIndex } from './utils';

const router = require('express').Router();

router.get('/slides', (req: Request, res: Response, next: NextFunction) => {
  reply(res, slides);
});

router.get(
  '/slides/:index',
  (req: Request, res: Response, next: NextFunction) => {
    const index = req.params?.index;

    let slide;

    if (index !== undefined) {
      const indexNumber = parseInt(index, 10);
      slide = getByIndex(slides)(indexNumber);
    }

    if (slide) {
      reply(res, slide);
    } else {
      reply(res, { lastIndex: true });
    }
  }
);

module.exports = router;
