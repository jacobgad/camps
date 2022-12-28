import type { GetServerSidePropsContext, PreviewData } from "next";
import type { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { getSession } from "next-auth/react";

type Context = GetServerSidePropsContext<NextParsedUrlQuery, PreviewData>;

export async function isAuthed(context: Context) {
  const session = await getSession(context);
  if (session) return null;
  return {
    redirect: {
      destination: `/?callbackUrl=${context.resolvedUrl}`,
      permanent: false,
    },
  };
}
