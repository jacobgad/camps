import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import { Inter } from "@next/font/google";
import Head from "next/head";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });
const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Camps</title>
        <meta name="description" content="Church Camp management tool" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div id="next-font" className={inter.className}>
        <Component {...pageProps} />
        <Toaster />
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
