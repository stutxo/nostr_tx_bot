import express from 'express';
import { start_bot }  from "./bot.js";
import promclient from "express-prom-bundle";


//endpoint for prometheus
const metrics = promclient({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  includeUp: true,
  customLabels: {
    project_name: "mempool_bot",
    project_type: "nostr bot",
  },
  promClient: {
    collectDefaultMetrics: {},
  },
});

//endpoint for health check
const router = express.Router({});
router.get("/", async (_req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: "OK, I'm healthy",
    timestamp: Date.now(),
  };
  try {
    res.send(healthcheck);
  } catch (error) {
    healthcheck.message = error;
    res.status(503).send();
  }
});

const app = express();
const PORT = process.env.PORT || 4111;
app.listen(console.log("api server started on port: " + PORT));
app.use("/health", router);
app.use("/metrics", metrics);

//start mempool bot
start_bot();



