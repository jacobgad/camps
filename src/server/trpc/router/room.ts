import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const roomRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3),
        capacity: z.number().min(1),
        campId: z.string().cuid(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.room.create({ data: input });
    }),

  getAll: protectedProcedure
    .input(z.object({ campId: z.string().cuid() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.room.findMany({
        where: { campId: input.campId },
        include: {
          members: {
            include: {
              user: { select: { name: true } },
            },
          },
        },
      });
    }),

  get: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.room.findUnique({
        where: { id: input.id },
        include: {
          members: {
            where: { userId: ctx.session.user.id },
            include: { user: { select: { name: true } } },
          },
        },
      });
    }),

  join: protectedProcedure
    .input(
      z.object({
        roomId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const room = await ctx.prisma.room.findUnique({
        where: { id: input.roomId },
      });
      if (!room)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Room does not exist",
        });

      const member = await ctx.prisma.member.findUnique({
        where: {
          campId_userId: { campId: room.campId, userId: ctx.session.user.id },
        },
      });
      if (!member)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not a member of this camp",
        });

      return ctx.prisma.member.update({
        where: { id: member.id },
        data: { roomId: input.roomId },
      });
    }),
});
