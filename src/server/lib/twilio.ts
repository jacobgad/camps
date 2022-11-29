import { Twilio } from "twilio";
import { env } from "../../env/server.mjs";

declare global {
  // eslint-disable-next-line no-var
  var twilio: Twilio | undefined;
}

export const twilio =
  global.twilio || new Twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

if (env.NODE_ENV !== "production") {
  global.twilio = twilio;
}
