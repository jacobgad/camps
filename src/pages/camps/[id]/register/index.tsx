import { ArrowRightIcon, HashtagIcon } from "@heroicons/react/20/solid";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import Button from "../../../../components/Button";
import Input from "../../../../components/forms/Input";
import InputWithButton from "../../../../components/forms/InputWithButton";
import RegisterHeader from "../../../../components/RegisterHeader";

export default function Register() {
  const session = useSession();
  const [values, setValues] = useState({ phone: "", token: "" });

  return (
    <div className="flex h-full flex-col">
      <RegisterHeader />

      <div className="flex-grow p-4">
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
            disabled={!values.phone}
            label="Verification Code"
            value={values.token}
            onChange={(e) => setValues({ ...values, token: e.target.value })}
          />
        </div>
      </div>

      <div className="m-4">
        <Button Icon={ArrowRightIcon}>
          <Link
            href={`/api/auth/callback/email?callbackUrl=http://localhost:3000/camps/clb7yzoc40001jv09f8z0d125/register/updateInfo&token=${
              values.token
            }&email=${encodeURIComponent(values.phone + "@phone.number")}`}
          >
            Next {session.status === "loading" && "loading..."}
          </Link>
        </Button>
      </div>
    </div>
  );
}
