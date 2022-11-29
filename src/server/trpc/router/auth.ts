import { add } from "date-fns";
import { z } from "zod";
import { getToken, hashToken } from "../../../utils/auth";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { twilio } from "../../lib/twilio";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
  sendTokenSMS: publicProcedure
    .input(
      z.object({
        identifier: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const token = getToken();
      await ctx.prisma.verificationToken.deleteMany({
        where: { identifier: input.identifier },
      });
      await ctx.prisma.verificationToken.create({
        data: {
          identifier: input.identifier,
          token: hashToken(token),
          expires: add(new Date(), { hours: 1 }),
        },
      });
      try {
        await twilio.messages.create({
          messagingServiceSid: "MG73ed4d7a02a2c82c5c98e137aade97d9",
          from: "Camps",
          to: input.identifier,
          body: "Your code is: " + token,
        });
      } catch (e) {
        console.log(e);
      }
    }),
});
