import express from 'express';
import upload from '../../utils/ImgUploder.js';
import { bannerController } from './banner.controller.js';


const router = express.Router();

router.post(
  '/create-banner',
  upload.single('image'),
  bannerController.createBanner,
);
router.get('/', bannerController.getAllBanner);
router.get('/active', bannerController.getAllActiveBanner);

router.put(
  '/:id',
  upload.single('image'),
  bannerController.updateSingleBanner,
);
router.delete('/:id', bannerController.deleteSingleBanner);

export const bannerRoutes = router;
