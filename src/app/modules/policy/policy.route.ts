import express from 'express';

import { policyController } from './policy.controller.js';

const router = express.Router();

router.post('/create-policy', policyController.createPolicy);
router.get('/', policyController.getAllPolicy);
router.get("/type", policyController.getAllPolicyByType);

router.patch('/:id', policyController.updateSinglePolicy);
router.delete('/:id', policyController.deleteSinglePolicy);

export const policyRoutes = router;
