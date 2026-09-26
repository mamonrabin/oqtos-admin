import express from 'express';
import { reviewController } from './review.controller.js';
import upload from '../../utils/ImgUploder.js';

const router = express.Router();

router.post(
  '/create-review',
  upload.fields([{ name: 'images', maxCount: 5 }]),
  reviewController.createReview,
);
router.get('/', reviewController.getReview);
router.get('/', reviewController.getAllReview);
router.get('/:id', reviewController.getSingleReview);
router.patch('/:id', reviewController.updateSingleReview);

router.delete('/:id', reviewController.deleteSingleReview);

export const reviewRoutes = router;
