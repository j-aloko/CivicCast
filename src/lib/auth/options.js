import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import prisma from "../db/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (user) {
        token.id = user.id;
        token.provider = account?.provider;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.id;
        session.user.provider = token.provider;
      }
      return session;
    },
    signIn: async () => {
      return true;
    },
  },
  debug: process.env.NODE_ENV === "development",
  pages: {
    error: "/auth/error",
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    maxAge: 30 * 24 * 60 * 60,
    strategy: "jwt",
  },
};

export default authOptions;
