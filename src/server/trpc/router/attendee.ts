import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { phoneSchema } from "utils/form";

export const attendeeRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3),
        phoneNumber: phoneSchema,
        teamId: z.number().positive(),
        role: z.enum(["servant", "attendee"]).default("attendee"),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.attendee.create({ data: input });
    }),

  getAll: protectedProcedure
    .input(
      z.object({
        campId: z.string().cuid(),
      })
    )
    .query(async ({ input, ctx }) => {
      const campTeams = await ctx.prisma.team.findMany({
        where: { campId: input.campId },
      });
      const campTeamIds = campTeams.map((t) => t.id);
      return ctx.prisma.attendee.findMany({
        where: { teamId: { in: campTeamIds } },
        include: { team: true },
        orderBy: { name: "asc" },
      });
    }),

  get: protectedProcedure
    .input(
      z.object({
        id: z.number().int(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.attendee.findUnique({
        where: { id: input.id },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number().int(),
        name: z.string().min(3),
        phoneNumber: phoneSchema,
        teamId: z.number().positive(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const team = await ctx.prisma.team.findFirst({
        where: {
          id: input.id,
          camp: { organisers: { some: { id: ctx.session.user.id } } },
        },
      });

      if (!team) throw new TRPCError({ code: "UNAUTHORIZED" });

      return ctx.prisma.attendee.update({
        where: { id: input.id },
        data: input,
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.number().int(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const team = await ctx.prisma.team.findFirst({
        where: {
          id: input.id,
          camp: { organisers: { some: { id: ctx.session.user.id } } },
        },
      });

      if (!team) throw new TRPCError({ code: "UNAUTHORIZED" });

      return ctx.prisma.attendee.delete({ where: { id: input.id } });
    }),
});
