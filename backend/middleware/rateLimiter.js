import rateLimit from "express-rate-limit";

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max:      200,
  message:  { error: "Too many requests, please try again later." },
});

export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max:      30,
  message:  { error: "Upload limit reached, please try again in an hour." },
});