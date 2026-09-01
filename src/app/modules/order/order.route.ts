import express from 'express';
import { orderController } from './order.controller.js';


const router = express.Router();

router.post(
  '/create-order',
  orderController.createOrder,
);
router.get('/', orderController.getAllOrder);
router.get("/today", orderController.getTodayOrders);
router.get('/:id', orderController.getSingleOrder);
router.get('/orderId/:orderID', orderController.getOrderByOrderID);
router.patch('/:id', orderController.updateSingleOrder);
router.delete('/:id', orderController.deleteSingleOrder);

export const orderRoutes = router;
