import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const redis = new Redis(redisUrl, {
  tls: redisUrl.startsWith("rediss://") ? {} : undefined,
});

redis.on("connect", () => {
  console.log("✅ Redis Cloud connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis error", err);
});

export default redis;
