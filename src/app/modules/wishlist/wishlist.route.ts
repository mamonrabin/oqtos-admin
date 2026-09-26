import express from 'express';
import { wishlistController } from './wishlist.controller.js';

const router = express.Router();

router.post('/create-wishlist', wishlistController.createWishlist);

router.get('/', wishlistController.getAllWishlist);

router.get('/user/:userId', wishlistController.getWishlistByUser);

router.get('/:id', wishlistController.getSingleWishlist);

router.patch('/:id', wishlistController.updateSingleWishlist);

router.delete('/:id', wishlistController.deleteSingleWishlist);

// router.delete(
//   "/:userId/:productId",
//   wishlistController.deleteSingleWishlist
// );

export const wishlistRoutes = router;
