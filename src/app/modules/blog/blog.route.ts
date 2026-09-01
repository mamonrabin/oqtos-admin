import express from 'express';

import upload from '../../utils/ImgUploder.js';
import { blogController } from './blog.controller.js';

const router = express.Router();

router.post(
  '/create-blog',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 5 },
  ]),
  blogController.createBlog,
);
router.get('/', blogController.getAllBlog);
router.get('/published', blogController.getAllBlogByStatus);
router.get('/:id', blogController.getSingleBlog);
router.get('/blogSlug/:slug', blogController.getSingleBlogBySlug);
router.patch('/:id/status', blogController.updateBlogStatus);
router.put(
  '/:id',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 5 },
  ]),
  blogController.updateSingleBlog,
);
router.delete('/:id', blogController.deleteSingleBlog);

export const blogRoutes = router;
