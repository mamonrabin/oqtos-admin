
/* eslint-disable @typescript-eslint/no-explicit-any */

import passport from "passport";
import {
  Strategy as GoogleStrategy,
  type Profile,
  type VerifyCallback,
} from "passport-google-oauth20";

import config from "./index.js";
import { IsActive, Role } from "../modules/user/user.interface.js";
import { userModel } from "../modules/user/user.model.js";

const clientID = config.google_client_id;
const clientSecret = config.google_client_secret;
const callbackURL = config.google_callback_url;

// Validate required environment variables
if (!clientID || !clientSecret || !callbackURL) {
  throw new Error(
    "Missing Google OAuth configuration: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET or GOOGLE_CALLBACK_URL"
  );
}

passport.use(
  new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL,
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(null, false, {
            message: "No email found",
          });
        }

        let user = await userModel.findOne({ email });

        if (
          user &&
          (user.isActive === IsActive.BLOCKED ||
            user.isActive === IsActive.INACTIVE)
        ) {
          return done(null, false, {
            message: `User is ${user.isActive}`,
          });
        }

        if (user?.isDeleted) {
          return done(null, false, {
            message: "User is deleted",
          });
        }

        if (!user) {
          user = await userModel.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0]?.value ?? "",
            role: Role.USER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }

        return done(null, user);
      } catch (error) {
        console.error("Google Strategy Error:", error);
        return done(error as Error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
