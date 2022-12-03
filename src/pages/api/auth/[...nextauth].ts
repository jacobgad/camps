import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Twilio } from "twilio";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";
import { getToken } from "../../../utils/auth";

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
    // error: "/auth/error",
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    EmailProvider({
      type: "email",
      generateVerificationToken: getToken,
      sendVerificationRequest: async ({ identifier, token }) => {
        const twilio = new Twilio(
          env.TWILIO_ACCOUNT_SID,
          env.TWILIO_AUTH_TOKEN
        );
        console.log({ identifier });
        const phoneNumber = identifier.split("@").at(0);
        if (!phoneNumber) throw new Error("invalid phone number");
        try {
          await twilio.messages.create({
            messagingServiceSid: "MG73ed4d7a02a2c82c5c98e137aade97d9",
            from: "Camps",
            to: phoneNumber,
            body: `Your code is: ${token}`,
          });
        } catch (error) {
          console.error({ SMSError: error });
        }
      },
    }),
  ],
};

export default NextAuth(authOptions);
