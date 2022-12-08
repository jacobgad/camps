import { router } from "../trpc";
import { authRouter } from "./auth";
import { campRouter } from "./camp";
import { exampleRouter } from "./example";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  camp: campRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
