import { router } from "../trpc";
import { authRouter } from "./auth";
import { campRouter } from "./camp";
import { exampleRouter } from "./example";
import { itineraryRouter } from "./itinerary";
import { memberRouter } from "./member";
import { roomRouter } from "./room";
import { userRouter } from "./user";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  camp: campRouter,
  itinerary: itineraryRouter,
  room: roomRouter,
  member: memberRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
