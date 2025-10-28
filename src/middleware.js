import { withAuth } from "next-auth/middleware";

export default withAuth(function middleware() {}, {
  callbacks: {
    authorized: ({ token, req }) => {
      const { pathname } = req.nextUrl;
      if (["/auth/signin", "/auth/signup"].includes(pathname)) {
        return true;
      }
      const protectedPatterns = ["/polls/create", "/dashboard", "/polls/:id*"];
      const isProtected = protectedPatterns.some((pattern) => {
        if (pattern === "/polls/:id*") {
          return pathname.startsWith("/polls/") && pathname !== "/polls";
        }
        return pathname === pattern || pathname.startsWith(`${pattern}/`);
      });
      return isProtected ? !!token : true;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});

export const config = {
  matcher: [
    "/polls/create",
    "/dashboard",
    "/polls/:id*",
    "/auth/signin",
    "/auth/signup",
  ],
};
