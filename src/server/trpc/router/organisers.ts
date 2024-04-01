import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const organiserRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        campId: z.string().cuid(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.camp.update({
        where: { id: input.campId },
        data: { organisers: { connect: { email: input.email } } },
      });
    }),

  getAll: protectedProcedure
    .input(
      z.object({
        campId: z.string().cuid(),
      })
    )
    .query(async ({ input, ctx }) => {
      const camp = await ctx.prisma.camp.findUnique({
        where: { id: input.campId },
        include: { organisers: { orderBy: { name: "asc" } } },
      });
      if (!camp) throw new TRPCError({ code: "BAD_REQUEST" });
      return camp.organisers;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        userId: z.string().cuid(),
        campId: z.string().cuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.camp.update({
        where: { id: input.campId },
        data: { organisers: { disconnect: { id: input.userId } } },
      });
    }),
});
