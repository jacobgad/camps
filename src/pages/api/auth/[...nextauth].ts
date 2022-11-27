import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Twilio } from "twilio";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`;
}

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  pages: {
    verifyRequest: "/auth/verify",
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    EmailProvider({
      generateVerificationToken: () => Math.random().toString().substring(2, 8), //6 digit token
      sendVerificationRequest: async ({ identifier, url, token }) => {
        const { host } = new URL(url);
        const twilio = new Twilio(
          env.TWILIO_ACCOUNT_SID,
          env.TWILIO_AUTH_TOKEN
        );
        console.log({ identifier });
        try {
          await twilio.messages.create({
            messagingServiceSid: "MG73ed4d7a02a2c82c5c98e137aade97d9",
            from: "Camps",
            to: identifier.split("@")[0],
            body: text({ url, host }), //can send token instead of url
          });
          console.log({ sent: text({ url, host }) });
        } catch (error) {
          console.error({ SMSError: error });
        }
      },
    }),
  ],
};

export default NextAuth(authOptions);
