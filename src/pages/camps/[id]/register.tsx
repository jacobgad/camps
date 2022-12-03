import ArrowRightIcon from "@heroicons/react/20/solid/ArrowRightIcon";
import { signIn } from "next-auth/react";
import { useState } from "react";
import InputWithButton from "../../../components/forms/InputWithButton";
import Input from "../../../components/forms/Input";
import { HashtagIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import Button from "../../../components/Button";
import Image from "next/image";

export default function Register() {
  const [values, setValues] = useState({ phone: "", token: "" });

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
              onClick: () =>
                signIn("email", {
                  email: values.phone + "@phone.number",
                  redirect: false,
                }),
            }}
          />
          <Input
            Icon={HashtagIcon}
            label="Verification Code"
            value={values.token}
            onChange={(e) => setValues({ ...values, token: e.target.value })}
          />
        </div>
      </div>

      <div className="p-5">
        <div className="space-y-2">
          <Button Icon={ArrowRightIcon}>
            <Link
              href={`/api/auth/callback/email?token=${
                values.token
              }&email=${encodeURIComponent(values.phone + "@phone.number")}`}
            >
              Next
            </Link>
          </Button>
          <Button onClick={() => signIn("google")}>
            <Image
              src="/assets/googleLogo.svg"
              alt="Google Logo"
              width={20}
              height={20}
              className="mr-2"
            />
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
