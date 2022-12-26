import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const memberRouter = router({
  get: protectedProcedure
    .input(
      z.object({
        campId: z.string().cuid(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.member.findUnique({
        where: {
          campId_userId: { userId: ctx.session.user.id, campId: input.campId },
        },
        include: {
          camp: { include: { itineraryItems: { include: { options: true } } } },
          user: true,
          room: true,
        },
      });
    }),
});
