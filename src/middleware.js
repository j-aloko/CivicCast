import { withAuth } from "next-auth/middleware";

export default withAuth(function middleware() {}, {
  callbacks: {
    authorized: ({ token, req }) => {
      const { pathname } = req.nextUrl;
      if (["/auth/signin", "/auth/signup"].includes(pathname)) {
        return !token;
      }
      const protectedRoutes = ["/polls/create", "/dashboard", "/polls/[id]"];
      const isProtectedRoute = protectedRoutes.some((route) => {
        if (route.includes("[id]")) {
          return pathname.startsWith("/polls/") && pathname !== "/polls";
        }
        return pathname === route;
      });

      if (isProtectedRoute) {
        return !!token;
      }
      return true;
    },
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
