import dotenv from "dotenv";
import { startWorker, queue } from "./queues";

dotenv.config({ path: ".env" });

startWorker();
queue.add("noop", { t: Date.now() }, { removeOnComplete: true, removeOnFail: true }).then(() => {
  console.log("Worker bootstrapped and test job enqueued.");
});
