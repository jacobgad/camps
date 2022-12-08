import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const itineraryRouter = router({
  get: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.itineraryItem.findMany({
        where: { campId: input.id },
        include: { options: true },
        orderBy: { date: "asc" },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(3),
        description: z.string().min(3),
        date: z.date(),
        campId: z.string().cuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const member = await ctx.prisma.member.findUnique({
        where: {
          campId_userId: {
            campId: input.campId,
            userId: ctx.session.user.id,
          },
        },
      });
      if (member?.role !== "organiser") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not an organiser of this camp",
        });
      }
      return ctx.prisma.itineraryItem.create({
        data: input,
      });
    }),
});
