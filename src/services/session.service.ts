import { get } from "lodash";
import { config } from "../config";
import { signJWT, verifyJWT } from "../utils/jwt.utils";

export async function createSession(user_uuid: string, userAgent?: string) {
  try {
    //logic here >>>>>>
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function getSession(id: number) {
  try {
    //logic here >>>>>>
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function reIssueAccessToken(refreshToken: string) {
  const { decoded } = verifyJWT(refreshToken);

  if (!decoded || !get(decoded, "session") || !get(decoded, "user_uuid")) {
    return false;
  }

  const session = await getSession(get(decoded, "session"));
  if (!session) return false; //not found

  if (get(decoded, "user_uuid") !== session.user_uuid) return false; //something is just wrong over here, wrong user_uuid somewhere

  const accessToken = signJWT(
    { user_uuid: session.user_uuid, session: session.id },
    { expiresIn: config.accessTokenToLive }
  );

  return accessToken;
}
