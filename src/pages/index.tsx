import { type NextPage } from "next";
import Button from "@ui/Button";
import Link from "next/link";
import Layout from "../components/layout/Layout";

const Home: NextPage = () => {
  return (
    <Layout>
      <h1 className="mb-4">Camps</h1>
      <Link href="/camps">
        <Button text="My Camps" fullWidth className="justify-center" />
      </Link>
    </Layout>
  );
};

export default Home;
