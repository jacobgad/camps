import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import Button from "../../../../components/Button";
import SmsAuthLogin from "../../../../components/registration/SmsAuthLogin";
import UpdatePersonalInfo from "../../../../components/registration/UpdatePersonalInfo";
import { trpc } from "../../../../utils/trpc";

export default function Register() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data } = trpc.camps.getCamp.useQuery(
    { id },
    {
      enabled: !!id,
    }
  );

  const session = useSession();
  const [step, setStep] = useState(0);

  return (
    <div className="flex h-full flex-auto flex-col">
      <header className="w-full bg-indigo-600 px-4 pt-4 pb-6 text-indigo-200">
        <h1 className="text-xs font-medium uppercase leading-4 tracking-wider">
          Camp Registration
        </h1>
        <h2 className="mb-1 text-2xl font-extrabold leading-8 text-indigo-50">
          {data?.name}
        </h2>
        <p className="text-xs font-medium uppercase leading-4 tracking-wide">
          {data?.organiser}
        </p>
      </header>

      <div className="flex-grow p-4">
        {session.status === "loading" && <p>loading...</p>}
        {(session.status === "unauthenticated" || step === 0) && (
          <SmsAuthLogin />
        )}
        {session.status === "authenticated" && step === 1 && (
          <UpdatePersonalInfo />
        )}
      </div>

      <div className="flex justify-center gap-2">
        {[0, 1, 2, 3].map((val) => (
          <input
            key={val}
            type="radio"
            defaultChecked={val === step}
            className="h-5 w-5 border-none transition"
          />
        ))}
      </div>
      <div className="flex gap-2 p-4">
        <Button onClick={() => step > 0 && setStep(step - 1)}>Back</Button>
        <Button onClick={() => step < 3 && setStep(step + 1)}>Next</Button>
      </div>
    </div>
  );
}
