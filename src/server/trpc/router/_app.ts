import { router } from "../trpc";
import { campRouter } from "./camp";
import { userRouter } from "./user";

export const appRouter = router({
  camps: campRouter,
  users: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
