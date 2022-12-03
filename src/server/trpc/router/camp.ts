import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const campRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(5),
        organiser: z.string().min(5),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const camp = await ctx.prisma.camp.create({
        data: input,
      });
      await ctx.prisma.campToUser.create({
        data: {
          campId: camp.id,
          userId: ctx.session.user.id,
          role: "Organiser",
        },
      });
      return camp;
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.camp.findMany({
      where: {
        CampToUser: {
          some: { userId: ctx.session.user.id, role: "Organiser" },
        },
      },
      include: { CampToUser: { include: { user: true } } },
    });
  }),
});
