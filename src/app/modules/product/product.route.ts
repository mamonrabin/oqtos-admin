import express from 'express';
import upload from '../../utils/ImgUploder.js';
import { productController } from './product.controller.js';

const router = express.Router();

router.post(
  '/create-product',
  upload.fields([
    { name: 'thumbnailImage', maxCount: 1 },
    { name: 'backviewImage', maxCount: 1 },
    { name: 'images', maxCount: 5 },
  ]),
  productController.createProduct,
);

router.get('/', productController.getAllProduct);
router.get('/withoutBuilder', productController.getAllProductWithoutBuilder);
router.get('/related-products/:id', productController.getReletiveProduct);
router.get('/dicount-products', productController.getDiscountProducts);
router.get('/new-products', productController.getNewArrivalProducts);
router.get('/category/:id', productController.getProductsByCategory);
router.get('/sub-category/:id', productController.getProductsBySubCategory);
router.get('/brand/:id', productController.getProductsByBrand);
router.get('/labels/:label', productController.getProductsByLabels);
router.get('/best-selling', productController.getBestSellingProducts);
router.get('/top-rated', productController.getTopProducts);
router.get('/:id', productController.getSingleProduct);
router.get('/productSlug/:slug', productController.getSingleProductBySlug);
router.put(
  '/:id',
  upload.fields([
    { name: 'thumbnailImage', maxCount: 1 },
    { name: 'backviewImage', maxCount: 1 },
    { name: 'images', maxCount: 5 },
  ]),
  productController.updateSingleProduct,
);
router.delete('/:id', productController.deleteSingleProduct);

export const productRoutes = router;
