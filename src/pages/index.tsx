import { type NextPage } from "next";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";

const Home: NextPage = () => {
  const session = useSession();

  return (
    <div className="p-4">
      <h1>Camps</h1>

      <nav>
        <Link href="camps">My Camps</Link>
      </nav>

      {session.status === "unauthenticated" && (
        <button
          onClick={() =>
            toast.promise(signIn("google"), {
              loading: "loading...",
              success: "Welcome",
              error: "Error",
            })
          }
        >
          Sign In with Google
        </button>
      )}
      {session.status === "authenticated" && (
        <button onClick={() => signOut()}>Sign Out</button>
      )}
    </div>
  );
};

export default Home;
