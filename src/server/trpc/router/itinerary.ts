import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const itineraryRouter = router({
  getAll: protectedProcedure
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
        campId: z.string().cuid(),
        name: z.string().min(3),
        description: z.string().optional(),
        location: z.string().optional(),
        date: z.date(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const organiser = await ctx.prisma.user.findFirst({
        where: {
          id: ctx.session.user.id,
          camps: { some: { id: input.campId } },
        },
      });
      if (!organiser) {
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
