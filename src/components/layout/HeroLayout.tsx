import Image from "next/image";
import Layout from "./Layout";

type Props = {
  children: React.ReactNode;
};

export default function HeroLayout({ children }: Props) {
  return (
    <Layout variant="dark" gutter={false} className="relative z-0">
      <Image
        priority
        quality={100}
        src="/camps.png"
        width={448}
        height={631}
        alt="camps"
        className="-z-10 w-full"
      />
      <header className="absolute mt-14 w-full space-y-1 text-center uppercase text-[#2B3525]">
        <h1>Camps</h1>
        <p className="text-sm font-medium tracking-wide">Camp Registration</p>
      </header>

      <div className="mt-2 px-4 pb-8">{children}</div>
    </Layout>
  );
}
