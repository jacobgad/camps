import type { NextPage } from "next";
import GoogleLogoIcon from "@ui/icons/GoogleLogoIcon";
import { signIn, signOut, useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import {
  ArrowLeftOnRectangleIcon,
  EnvelopeIcon,
} from "@heroicons/react/20/solid";
import HeroLayout from "components/layout/HeroLayout";
import Button from "@ui/Button";
import Link from "next/link";

const Home: NextPage = () => {
  const session = useSession();
  const router = useRouter();
  const callbackUrl =
    (router.query.callbackUrl as string | undefined) ?? "/camps";

  return (
    <HeroLayout>
      <h2 className="text-lg font-medium text-gray-100">Welcome to Camps</h2>
      <div className="mt-1 mb-6 space-y-5 text-sm font-normal text-gray-400">
        <p>
          This website allows you to tailor your camp experience by selecting a
          room and the sessions you would like to attend to create a
          personalised itinerary for you.
        </p>
        <p>
          Your registration also helps camp organisers in reaching out to you if
          there’s any changes with your camp.
        </p>
        <p>Get started by signing in below</p>
      </div>

      {session.status === "authenticated" && (
        <>
          <Link href="/camps">
            <Button
              text="My Camps"
              size="large"
              className="justify-center"
              fullWidth
            />
          </Link>

          <Button
            text="Sign Out"
            size="large"
            Icon={ArrowLeftOnRectangleIcon}
            className="mt-6 justify-center"
            intent="secondary"
            fullWidth
            onClick={() => signOut()}
          />
        </>
      )}

      {session.status !== "authenticated" && (
        <>
          <button
            onClick={() => {
              toast.promise(signIn("google", { callbackUrl }), {
                error: "Error signing in",
                loading: "Loading...",
                success: "Welcome",
              });
            }}
            className="flex w-full items-center gap-4 rounded-lg border border-gray-700 p-4"
          >
            <GoogleLogoIcon />
            <span className="text-lg font-medium text-white">
              Sign In with Google
            </span>
          </button>

          <div className="inline-flex w-full items-center justify-center">
            <hr className="my-8 h-px w-64 border-0 bg-gray-700" />
            <span className="absolute left-1/2 -translate-x-1/2 bg-[#0D1522] px-3 font-medium text-gray-100">
              OR
            </span>
          </div>

          <button
            onClick={() => signIn("email", { callbackUrl })}
            className="flex w-full items-center gap-4 rounded-lg border border-gray-700 p-4"
          >
            <EnvelopeIcon className="h-6 text-white" />
            <span className="text-lg font-medium text-white">
              Sign In with Email
            </span>
          </button>
        </>
      )}
    </HeroLayout>
  );
};

export default Home;
