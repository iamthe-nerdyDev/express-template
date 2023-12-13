import { Express } from "express";
import passport from "passport";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import { Strategy as LocalStrategy } from "passport-local";
import { config } from "../config";
import { createUser, getUser } from "../services/user.service"; //just get the createUser & getUser function
import bcryptjs from "bcryptjs";
import { omit } from "lodash";

function initPassport(app: Express) {
  app.use(passport.initialize());

  //#ensuring that google clientID is passed
  if (!config.passport.google.clientID) {
    throw new Error("missing .env variable: GOOGLE_CLIENT_ID");
  }
  //#ensuring that google clientSecret is passed
  if (!config.passport.google.clientSecret) {
    throw new Error("missing .env variable: GOOGLE_CLIENT_SECRET");
  }

  //for login with email and password
  passport.use(
    "local",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        session: false,
      },
      async (email, password, done) => {
        const user = await getUser({ emailAddress: email }, false);
        if (!user) return done(new Error("Wrong email"));

        const compare = await bcryptjs.compare(password, user.password);
        if (!compare) return done(new Error("Wrong password"));

        //login is successful
        return done(false, omit(user, "password"));
      }
    )
  );

  //for login with google
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.passport.google.clientID,
        clientSecret: config.passport.google.clientSecret,
        callbackURL: config.base_url + "/api/v1/login/callback/google",
        passReqToCallback: true,
      },
      function (_, __, ___, profile, done) {
        process.nextTick(async function () {
          try {
            //incase phone number was used to create google account
            if (!profile._json.email) {
              return done(new Error("Email not linked to google account"));
            }

            const { user, error } = await createUser({
              providerId: profile.id,
              firstName: profile._json.given_name,
              lastName: profile._json.family_name,
              profileImage: profile._json.picture,
              emailAddress: profile._json.email,
              provider: "google",
            });

            if (error) return done(new Error(error));

            return done(null, user);
          } catch (err) {
            return done(new Error("Unknown error"));
          }
        });
      }
    )
  );
}

export default { initPassport };
