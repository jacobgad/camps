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
      // const user = await ctx.prisma.user.findFirst({
      //   where: {
      //     id: ctx.session.user.id,
      //     OR: [
      //       {
      //         camps: {
      //           some: { organisers: { some: { id: ctx.session.user.id } } },
      //         },
      //       },
      //       {
      //         camps: {
      //           some: { members: { some: { userId: ctx.session.user.id } } },
      //         },
      //       },
      //     ],
      //   },
      // });

      // if (!user) {
      //   throw new TRPCError({
      //     code: "UNAUTHORIZED",
      //     message: "You are not associated with this camp",
      //   });
      // }

      return ctx.prisma.itineraryItem.findMany({
        where: { campId: input.campId },
        include: {
          options: {
            include: { members: { select: { id: true, userId: true } } },
            orderBy: { name: "asc" },
          },
        },
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
      // const user = await ctx.prisma.user.findFirst({
      //   where: {
      //     id: ctx.session.user.id,
      //     OR: [
      //       {
      //         camps: {
      //           some: { organisers: { some: { id: ctx.session.user.id } } },
      //         },
      //       },
      //       {
      //         camps: {
      //           some: { members: { some: { userId: ctx.session.user.id } } },
      //         },
      //       },
      //     ],
      //   },
      // });

      // if (!user) {
      //   throw new TRPCError({
      //     code: "UNAUTHORIZED",
      //     message: "You are not associated with this camp",
      //   });
      // }

      return ctx.prisma.itineraryItem.findUnique({
        where: { id: input.id },
        include: {
          options: {
            include: {
              members: {
                select: {
                  id: true,
                  user: { select: { name: true, email: true } },
                },
                orderBy: { user: { name: "asc" } },
              },
            },
            orderBy: { name: "asc" },
          },
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        campId: z.string().cuid(),
        name: z.string().min(3),
        date: z.date(),
        description: z.string().optional().nullable(),
        location: z.string().optional().nullable(),
        linkName: z.string().optional().nullable(),
        linkUrl: z.string().optional().nullable(),
        options: z
          .array(
            z.object({
              name: z.string().min(3),
              capacity: z.number().positive(),
              description: z.string().optional().nullable(),
              location: z.string().optional().nullable(),
              linkName: z.string().optional().nullable(),
              linkUrl: z.string().optional().nullable(),
            })
          )
          .optional(),
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

      const { options: itineraryOptions, ...itineraryItem } = input;
      return ctx.prisma.itineraryItem.create({
        data: {
          ...itineraryItem,
          options: { createMany: { data: itineraryOptions ?? [] } },
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(3),
        date: z.date(),
        description: z.string().optional().nullable(),
        location: z.string().optional().nullable(),
        linkName: z.string().optional().nullable(),
        linkUrl: z.string().optional().nullable(),
        options: z
          .array(
            z.object({
              id: z.number().optional(),
              name: z.string().min(3),
              capacity: z.number().positive(),
              description: z.string().optional().nullable(),
              location: z.string().optional().nullable(),
              linkName: z.string().optional().nullable(),
              linkUrl: z.string().optional().nullable(),
            })
          )
          .optional(),
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
      const { options: _inputOptions, ...inputItem } = input;
      const inputOptions = _inputOptions ?? [];

      return ctx.prisma.$transaction(async (tx) => {
        //Update itinerary item
        const item = await tx.itineraryItem.update({
          where: { id: input.id },
          data: inputItem,
          include: { options: true },
        });

        //update or create new or updated options
        await Promise.all(
          inputOptions
            .filter((opt) => opt.id !== undefined)
            .map((option) =>
              tx.itineraryOption.update({
                where: { id: option.id },
                data: { ...option, itineraryItemId: input.id },
              })
            )
        );

        //update or create new or updated options
        await Promise.all(
          inputOptions
            .filter((opt) => opt.id === undefined)
            .map((option) =>
              tx.itineraryOption.create({
                data: { ...option, itineraryItemId: input.id },
              })
            )
        );

        //Delete options that have been removed
        const inputOptionIds = input.options?.map((option) => option.id) ?? [];
        const optionIdsToBeDeleted = item.options
          .filter((option) => !inputOptionIds.includes(option.id))
          .map((option) => option.id);

        await tx.itineraryOption.deleteMany({
          where: { id: { in: optionIdsToBeDeleted } },
        });

        return ctx.prisma.itineraryItem.findUnique({
          where: { id: input.id },
          include: {
            options: {
              include: {
                members: {
                  select: {
                    id: true,
                    user: { select: { name: true, email: true } },
                  },
                  orderBy: { user: { name: "asc" } },
                },
              },
              orderBy: { name: "asc" },
            },
          },
        });
      });
    }),

  join: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const option = await ctx.prisma.itineraryOption.findUnique({
        where: { id: input.id },
        include: {
          members: true,
          itineraryItem: { include: { options: true } },
        },
      });

      if (!option) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Itinerary option does not exist",
        });
      }

      if (option.capacity <= option.members.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Itinerary option has reached capacity",
        });
      }

      await Promise.all(
        option.itineraryItem.options.map((opt) =>
          ctx.prisma.itineraryOption.update({
            where: { id: opt.id },
            data: {
              members: {
                disconnect: {
                  campId_userId: {
                    campId: option.itineraryItem.campId,
                    userId: ctx.session.user.id,
                  },
                },
              },
            },
          })
        )
      );

      return ctx.prisma.itineraryOption.update({
        where: { id: input.id },
        data: {
          members: {
            connect: {
              campId_userId: {
                campId: option.itineraryItem.campId,
                userId: ctx.session.user.id,
              },
            },
          },
        },
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
