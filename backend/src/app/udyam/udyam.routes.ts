import { Router } from 'express';
import { UdyamController } from './udyam.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();
const controller = new UdyamController();

router.post('/send-otp', asyncHandler(controller.sendOtp));
router.post('/verify-aadhaar', asyncHandler(controller.verifyAadhaar));
router.post('/verify-pan', asyncHandler(controller.verifyPan));
router.post('/submit', asyncHandler(controller.submit));
router.get('/:id', authMiddleware, asyncHandler(controller.getById));

export default router;
