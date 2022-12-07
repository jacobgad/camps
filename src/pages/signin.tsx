import type { NextPage } from "next";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";

const SignIn: NextPage = () => {
  const { query } = useRouter();
  const callbackUrl = query.callbackUrl as string | undefined;

  return (
    <div className="flex min-h-screen flex-col items-center p-4">
      <h1 className="mb-4 text-xl">Sign In</h1>
      <div className="grid w-full gap-2">
        <button
          onClick={() => signIn("google", { callbackUrl })}
          className="w-full rounded border bg-white px-4 py-2"
        >
          Sign In with Google
        </button>
        <div className="inline-flex w-full items-center justify-center">
          <hr className="my-8 h-px w-64 border-0 bg-gray-200 dark:bg-gray-700" />
          <span className="absolute left-1/2 -translate-x-1/2 bg-neutral-100 px-3 font-medium text-gray-900">
            OR
          </span>
        </div>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          className="rounded py-2 px-4"
        />
        <button
          onClick={() => signIn("email", { callbackUrl })}
          className="w-full rounded border bg-white px-4 py-2"
        >
          Sign In with Email
        </button>

        <button onClick={() => signOut()}>Sign Out</button>
      </div>
    </div>
  );
};

export default SignIn;
