import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const userRouter = router({
  getUser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
    });
  }),

  update: protectedProcedure
    .input(
      z.object({
        name: z.string().min(4),
        phone: z.string().min(10),
        gender: z.enum(["male", "female"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: input,
      });
    }),
});
