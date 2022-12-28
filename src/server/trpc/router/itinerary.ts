import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const itineraryRouter = router({
  getAll: protectedProcedure
    .input(
      z.object({
        campId: z.string().cuid(),
      })
    )
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          id: ctx.session.user.id,
          OR: [
            {
              camps: {
                some: { organisers: { some: { id: ctx.session.user.id } } },
              },
            },
            {
              camps: {
                some: { members: { some: { userId: ctx.session.user.id } } },
              },
            },
          ],
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not associated with this camp",
        });
      }

      return ctx.prisma.itineraryItem.findMany({
        where: { campId: input.campId },
        include: { options: true },
        orderBy: { date: "asc" },
      });
    }),

  get: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          id: ctx.session.user.id,
          OR: [
            {
              camps: {
                some: { organisers: { some: { id: ctx.session.user.id } } },
              },
            },
            {
              camps: {
                some: { members: { some: { userId: ctx.session.user.id } } },
              },
            },
          ],
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not associated with this camp",
        });
      }

      return ctx.prisma.itineraryItem.findUnique({
        where: { id: input.id },
        include: { options: true },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        campId: z.string().cuid(),
        name: z.string().min(3),
        description: z.string().optional().nullable(),
        location: z.string().optional().nullable(),
        date: z.date(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const organiser = await ctx.prisma.user.findFirst({
        where: {
          id: ctx.session.user.id,
          camps: {
            some: {
              id: input.campId,
              organisers: { some: { id: ctx.session.user.id } },
            },
          },
        },
      });

      if (!organiser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not an organiser of this camp",
        });
      }

      return ctx.prisma.itineraryItem.create({
        data: input,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(3),
        description: z.string().optional().nullable(),
        location: z.string().optional().nullable(),
        date: z.date(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const organiser = await ctx.prisma.user.findFirst({
        where: {
          id: ctx.session.user.id,
          camps: {
            some: {
              itineraryItems: { some: { id: input.id } },
              organisers: { some: { id: ctx.session.user.id } },
            },
          },
        },
      });

      if (!organiser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not an organiser of this camp",
        });
      }
      return ctx.prisma.itineraryItem.update({
        where: { id: input.id },
        data: input,
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const organiser = await ctx.prisma.user.findFirst({
        where: {
          id: ctx.session.user.id,
          camps: {
            some: {
              itineraryItems: { some: { id: input.id } },
              organisers: { some: { id: ctx.session.user.id } },
            },
          },
        },
      });

      if (!organiser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not an organiser of this camp",
        });
      }

      return ctx.prisma.itineraryItem.delete({
        where: { id: input.id },
      });
    }),
});
