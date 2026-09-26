import { Router } from 'express';
import { themeController } from './theme.controller.js';

const router = Router();

router.post('/create-theme', themeController.createTheme);

router.get('/', themeController.getAllTheme);

router.get('/:status', themeController.getThemeByStatus);

router.patch('/:id', themeController.updateSingleTheme);

router.delete('/:id', themeController.deleteSingleTheme);

export const themeRouter = router;
