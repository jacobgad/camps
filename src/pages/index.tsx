import { type NextPage } from "next";
import Link from "next/link";
import { signIn, signOut } from "next-auth/react";

const Home: NextPage = () => {
  return (
    <div className="p-5">
      <h1>Camps</h1>

      <nav>
        <Link href="camps">My Camps</Link>
      </nav>

      <button onClick={() => signIn("google")}>Sign In with Google</button>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
};

export default Home;
