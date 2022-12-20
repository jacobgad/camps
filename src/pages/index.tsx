import { type NextPage } from "next";
import Button from "@ui/Button";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <main className="px-4 py-8">
      <h1>Camps</h1>
      <Link href="/camps">
        <Button text="My Camps" />
      </Link>
    </main>
  );
};

export default Home;
