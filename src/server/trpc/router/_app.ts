import { router } from "../trpc";
import { authRouter } from "./auth";
import { campRouter } from "./camp";

export const appRouter = router({
  camps: campRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
