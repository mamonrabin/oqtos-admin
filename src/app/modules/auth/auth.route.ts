import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import { authControllers } from './auth.controller.js';
import { auth } from '../../utils/decodedToken.js';
import passport from 'passport';
import config from '../../config/index.js';
import { resetAuth } from '../../utils/resetAuth.js';

const router = Router();

router.post('/login', authControllers.credentialsLogin);
router.post('/logout', authControllers.logout);
router.post('/forgot-password', authControllers.forgotPassword);
// router.post('/reset-password', auth, authControllers.resetPassword);
router.post('/reset-password', resetAuth, authControllers.resetPassword);
router.post('/change-password', auth, authControllers.changePassword);

router.get(
  '/google',
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || '/';
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      state: redirect as string,
    })(req, res, next);
  },
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${config.frontend_url}/login?error=There is some issues with your account. Please contact with out support team!`,
  }),
  authControllers.googleCallbackController,
);

export const AuthRoutes = router;
