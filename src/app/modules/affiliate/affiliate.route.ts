import express from 'express';
import { affiliateController } from './affiliate.controller.js';

const router = express.Router();

router.post(
  '/create-affiliate',

  affiliateController.createAffiliate,
);
router.get('/', affiliateController.getAllAffiliate);
router.get('/active', affiliateController.getAllAciveAffiliate);

router.get('/:id', affiliateController.getSingleAffiliate);

router.patch(
  '/:id',

  affiliateController.updateSingleAffiliate,
);
router.delete('/:id', affiliateController.deleteSingleAffiliate);

export const affiliateRoutes = router;
