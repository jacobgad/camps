import { phoneSchema } from "utils/form";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const userRouter = router({
  get: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
    });
  }),

  update: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        dob: z.date().max(new Date()),
        phone: phoneSchema,
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: input,
      });
    }),
});
