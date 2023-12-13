import dotenv from "dotenv";
import { Pool } from "mysql2";

dotenv.config();

type IConfig = {
  db?: Pool; //incase of mysql connection
  mongodb_uri?: string;
  server: {
    port: number;
  };
  passport: {
    google: {
      clientID?: string;
      clientSecret?: string;
    };
  };
  smtp: {
    username: string;
    password: string;
    host: string;
    port: number;
  };
  saltWorkFactor: number;
  refreshTokenToLive: string;
  accessTokenToLive: string;
  passwordResetTokenValidity: number;
  jwt_secret: string;
  base_url: string;
  client_url: string;
};

const SERVER_PORT = process.env.SERVER_PORT
  ? parseInt(process.env.SERVER_PORT)
  : 1337;

const MONGODB_URI = process.env.MONGODB_URI;

const { SMTP_PORT, SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;

if (!SMTP_PORT) throw new Error(".env variable missing: SMTP_PORT");
if (!SMTP_HOST) throw new Error(".env variable missing: SMTP_HOST");
if (!SMTP_USER) throw new Error(".env variable missing: SMTP_USER");
if (!SMTP_PASS) throw new Error(".env variable missing: SMTP_PASS");

export const config: IConfig = {
  mongodb_uri: MONGODB_URI,
  server: { port: SERVER_PORT },
  passport: {
    google: {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  smtp: {
    username: SMTP_USER,
    password: SMTP_PASS,
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT),
  },
  saltWorkFactor: 10,
  refreshTokenToLive: "1y",
  accessTokenToLive: "5m",
  passwordResetTokenValidity: 24 * 60 * 60 * 1000, //24 hours...
  jwt_secret: process.env.JWT_SECRET_TOKEN || "xxxx-test-xxxx",
  base_url: process.env.BASE_SERVER_URL || `http://localhost:${SERVER_PORT}`,
  client_url: process.env.BASE_CLIENT_URL || "",
};
