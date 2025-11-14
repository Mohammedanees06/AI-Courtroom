import { createClient } from "redis";
import { ENV } from "./env.js";

const redisClient = createClient({
  url: ENV.REDIS_URL,
});

redisClient.on("connect", () => console.log("Redis Connected Successfully"));
redisClient.on("error", (err) => console.error("Redis Connection Error:", err));

await redisClient.connect();

export default redisClient;
