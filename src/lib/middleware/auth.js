import { getToken } from "next-auth/jwt";

export const withAuth = (handler) => {
  return async (req, res) => {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
        statusCode: 401,
        success: false,
      });
    }

    req.user = token;
    return handler(req, res);
  };
};

export const optionalAuth = (handler) => {
  return async (req, res) => {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    req.user = token || null;
    return handler(req, res);
  };
};
