import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Twilio } from "twilio";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";
import { getToken, hashToken } from "../../../utils/auth";

function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`;
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  // Include user.id on session
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user;
      }
      return token;
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
      type: "email",
      generateVerificationToken: getToken,
      sendVerificationRequest: async ({ identifier, url }) => {
        const { host } = new URL(url);
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
            body: text({ url, host }), //can send token instead of url
          });
          console.log({ sent: text({ url, host }) });
        } catch (error) {
          console.error({ SMSError: error });
        }
      },
    }),
    CredentialsProvider({
      name: "phone",
      credentials: {
        phone: { label: "Phone", type: "text", placeholder: "0400000000" },
        token: { label: "Token", type: "text", placeholder: "123456" },
      },
      async authorize(credentials) {
        console.log("credentials");
        console.log(credentials);
        if (!credentials?.phone || !credentials.token)
          throw new Error("Phone number or code not valid");
        const verificationToken = await prisma.verificationToken.findFirst({
          where: {
            identifier: credentials.phone,
            token: hashToken(credentials.token),
            expires: { gte: new Date() },
          },
        });
        console.log({ verificationToken });
        if (!verificationToken)
          throw new Error("Phone number or code not valid");
        // prisma.verificationToken.deleteMany({
        //   where: { identifier: credentials.phone },
        // });
        const user = await prisma.user.findUnique({
          where: { phone: credentials.phone },
        });
        console.log(user);
        if (user) return user;
        return prisma.user.create({
          data: {
            phone: verificationToken.identifier,
            phoneVerified: new Date(),
          },
        });
      },
    }),
  ],
};

export default NextAuth(authOptions);
