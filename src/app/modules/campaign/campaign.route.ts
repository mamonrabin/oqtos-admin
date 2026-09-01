import express from 'express';

import { campaignController } from './campaign.controller.js';
import upload from '../../utils/ImgUploder.js';

const router = express.Router();

router.post(
  '/create-campaign',
  upload.single('image'),
  campaignController.createCampaign,
);
router.get('/', campaignController.getAllCampaign);
router.get("/flash-sale", campaignController.getFlashSale);
router.get('/:id', campaignController.getSingleCampaign);
router.patch('/:id', upload.single('image'), campaignController.updateSingleCampaign);
router.delete('/:id', campaignController.deleteSingleCampaign);

export const campaignRoutes = router;
