import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const teamRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3),
        color: z.string(),
        campId: z.string().cuid(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.team.create({ data: input });
    }),

  getAll: protectedProcedure
    .input(
      z.object({
        campId: z.string().cuid(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.team.findMany({
        where: { campId: input.campId },
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
      return ctx.prisma.team.findUnique({
        where: { id: input.id },
        include: {
          members: {
            include: { user: { select: { name: true, email: true } } },
          },
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number().int(),
        name: z.string().min(3),
        color: z.string(),
        campId: z.string().cuid(),
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

      return ctx.prisma.team.update({ where: { id: input.id }, data: input });
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

      return ctx.prisma.team.delete({ where: { id: input.id } });
    }),
});
