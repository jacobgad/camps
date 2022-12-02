import ArrowRightIcon from "@heroicons/react/20/solid/ArrowRightIcon";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import InputWithButton from "../components/forms/InputWithButton";
import InputWithIcon from "../components/forms/InputWithIcon";
import { HashtagIcon } from "@heroicons/react/20/solid";
import toast from "react-hot-toast";

export default function Michael() {
  const { mutate } = trpc.auth.sendTokenSMS.useMutation();
  const [values, setValues] = useState({ phone: "", token: "" });

  const session = useSession();

  function handleCredentialsSignIn() {
    const promise = signIn("credentials", { ...values, redirect: false });
    toast.promise(promise, {
      loading: "Checking your code...",
      success: "Welcome",
      error: "Oops there was an error",
    });
  }

  return (
    <div className="flex h-full flex-auto flex-col">
      <header className="w-full bg-indigo-600 px-4 pt-4 pb-6 text-indigo-200">
        <h1 className="text-xs font-medium uppercase leading-4 tracking-wider">
          Camp Registration
        </h1>
        <h2 className="mb-1 text-2xl font-extrabold leading-8 text-indigo-50">
          The Overcomer
        </h2>
        <p className="text-xs font-medium uppercase leading-4 tracking-wide">
          Sydney Youth Committee (SYC)
        </p>
        <p className="text-xs font-medium uppercase leading-4 tracking-wide">
          Youth In Christ (YIC)
        </p>
      </header>

      <div className="flex-grow p-5">
        <h3 className="mb-1 text-lg font-medium leading-6">Registration</h3>
        <p className="mb-6 text-sm font-normal leading-5">
          Please enter your phone number below. You will then receive an SMS
          message with a link to complete registration
        </p>

        <div className="grid gap-6">
          <InputWithButton
            label="Phone Number"
            value={values.phone}
            setValue={(v) => setValues({ ...values, phone: v })}
            button={{
              label: "Verify",
              onClick: () => mutate({ identifier: values.phone }),
            }}
          />
          <InputWithIcon
            Icon={HashtagIcon}
            label="Verification Code"
            value={values.token}
            onChange={(e) => setValues({ ...values, token: e.target.value })}
          />
        </div>

        <div className="overflow-hidden">
          <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
      </div>

      <div className="p-5">
        <button
          type="button"
          onClick={handleCredentialsSignIn}
          className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Next
          <ArrowRightIcon className="ml-3 -mr-1 h-5 w-5" aria-hidden="true" />
        </button>
        <div className="flex justify-between">
          <button onClick={() => signIn("google")}>Sign in with Google</button>
          <button onClick={() => signOut()}>Sign Out</button>
        </div>
      </div>
    </div>
  );
}
