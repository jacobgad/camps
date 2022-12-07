import { type NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1>Camps</h1>
          <Link href="/camps">My Camps</Link>
        </div>
      </main>
    </>
  );
};

export default Home;
