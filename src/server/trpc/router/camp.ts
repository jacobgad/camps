import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const campRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3),
        organiser: z.string().min(3),
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.camp.create({
        data: {
          ...input,
          organisers: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const attending = await ctx.prisma.camp.findMany({
      where: { members: { some: { userId: ctx.session.user.id } } },
      include: { members: { where: { userId: ctx.session.user.id } } },
      orderBy: { startDate: "asc" },
    });

    const organising = await ctx.prisma.camp.findMany({
      where: { organisers: { some: { id: ctx.session.user.id } } },
      include: { organisers: { where: { id: ctx.session.user.id } } },
      orderBy: { startDate: "asc" },
    });

    return { attending, organising };
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
