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

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(3),
        capacity: z.number().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const room = await ctx.prisma.room.findUnique({
        where: { id: input.id },
        include: { members: true },
      });
      if (!room) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Room does not exist",
        });
      }

      if (room.members.length > input.capacity) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot reduce capacity to bellow member count",
        });
      }

      const user = await ctx.prisma.member.findFirst({
        where: {
          userId: ctx.session.user.id,
          campId: room.campId,
          role: "organiser",
        },
      });
      if (!user)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only organiser can update rooms",
        });

      return ctx.prisma.room.update({
        where: { id: input.id },
        data: input,
      });
    }),

  join: protectedProcedure
    .input(
      z.object({
        roomId: z.number(),
        memberId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const room = await ctx.prisma.room.findUnique({
        where: { id: input.roomId },
        include: { members: true },
      });

      if (!room) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Room does not exist",
        });
      }

      if (room.capacity <= room.members.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Room is full",
        });
      }

      const reqMember = await ctx.prisma.member.findUnique({
        where: {
          campId_userId: { campId: room.campId, userId: ctx.session.user.id },
        },
      });

      if (!reqMember) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not a member of this camp",
        });
      }

      if (reqMember.role !== "organiser" && reqMember.id !== input.memberId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only organisers can move other members",
        });
      }

      return ctx.prisma.member.update({
        where: { id: input.memberId },
        data: { roomId: input.roomId },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input, ctx }) => {
      const room = await ctx.prisma.room.findUnique({
        where: { id: input.id },
        include: {
          members: true,
          camp: {
            include: { members: { where: { userId: ctx.session.user.id } } },
          },
        },
      });

      if (room?.camp.members.at(0)?.role !== "organiser") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not an organiser of this camp",
        });
      }

      if (room.members.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Room must be empty to delete",
        });
      }

      return ctx.prisma.room.delete({
        where: { id: input.id },
      });
    }),
});
