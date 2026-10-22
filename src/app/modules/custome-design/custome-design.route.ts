import express from 'express';

import { customeController } from './custome-design.controller.js';

const router = express.Router();

router.post('/create-custome', customeController.createCustome);

router.get('/', customeController.getAllCustome);




router.get('/', customeController.getAllCustome);

router.get('/:id', customeController.getSingleCustome);

router.patch('/:id', customeController.updateSingleCustome);

router.delete('/:id', customeController.deleteSingleCustome);

export const customeRoutes = router;
