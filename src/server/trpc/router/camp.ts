import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const campRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(3),
        description: z.string().min(3),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const camp = await ctx.prisma.camp.create({ data: input });
      await ctx.prisma.member.create({
        data: {
          campId: camp.id,
          userId: ctx.session.user.id,
          role: "organiser",
        },
      });
      return camp;
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.camp.findMany({
      where: { members: { some: { userId: ctx.session.user.id } } },
    });
  }),

  get: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.camp.findUnique({
        where: { id: input.id },
      });
    }),
});
