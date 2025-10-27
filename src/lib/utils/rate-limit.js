import LRU from "lru-cache";

const rateLimitCache = new LRU({
  max: 500,
  ttl: 1000 * 60 * 5, // 5 minutes
});

export const rateLimit = (options = {}) => {
  return (req, res, next) => {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const token = req.headers.authorization || ip;
    const limit = options.limit || 10;
    const windowMs = options.windowMs || 60000;

    const key = `rate-limit:${token}:${req.url}`;
    const current = rateLimitCache.get(key) || {
      count: 0,
      resetTime: Date.now() + windowMs,
    };

    if (current.resetTime < Date.now()) {
      rateLimitCache.delete(key);
      current.count = 0;
      current.resetTime = Date.now() + windowMs;
    }

    if (current.count >= limit) {
      return res.status(429).json({
        error: "Too many requests",
        retryAfter: Math.ceil((current.resetTime - Date.now()) / 1000),
      });
    }

    current.count++;
    rateLimitCache.set(key, current, windowMs);

    res.setHeader("X-RateLimit-Limit", limit);
    res.setHeader("X-RateLimit-Remaining", limit - current.count);
    res.setHeader("X-RateLimit-Reset", Math.ceil(current.resetTime / 1000));

    return next();
  };
};
