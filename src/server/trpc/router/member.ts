import { TRPCError } from "@trpc/server";
import { sycTeams } from "utils/sycTeams";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const memberRouter = router({
  get: protectedProcedure
    .input(
      z.object({
        campId: z.string().cuid(),
      })
    )
    .query(async ({ input, ctx }) => {
      const member = await ctx.prisma.member.findUnique({
        where: {
          campId_userId: { userId: ctx.session.user.id, campId: input.campId },
        },
        include: {
          registrant: { include: { team: true } },
          camp: {
            include: {
              itineraryItems: {
                include: {
                  options: {
                    where: {
                      members: { some: { userId: ctx.session.user.id } },
                    },
                  },
                },
                orderBy: { date: "asc" },
              },
            },
          },
          user: true,
          room: true,
        },
      });

      if (!member)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "member does not exist",
        });

      return member;
    }),

  upsert: protectedProcedure
    .input(
      z.object({
        campId: z.string().cuid(),
        roomId: z.number().int(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const room = await ctx.prisma.room.findUnique({
        where: { id: input.roomId },
        include: { members: true },
      });

      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User does not exist",
        });
      }

      if (!user.phone) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User phone number not registered",
        });
      }

      if (!room) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Room does not exits",
        });
      }

      if (room.gender !== user.gender) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User gender does not match room gender",
        });
      }

      if (room.members.length >= room.capacity) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Room is full" });
      }

      const registrant = await ctx.prisma.registrant.findUnique({
        where: { campId_phone: { campId: input.campId, phone: user.phone } },
      });

      if (!registrant) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Registration not found please contact a servant",
        });
      }

      const member = await ctx.prisma.member.upsert({
        where: {
          campId_userId: { campId: input.campId, userId: ctx.session.user.id },
        },
        create: {
          campId: input.campId,
          userId: ctx.session.user.id,
          roomId: room.id,
          registrantId: registrant.id,
        },
        update: {
          roomId: room.id,
        },
      });
      return member;
    }),
});
