/**
 * mycel x402 gateway
 * 
 * network intelligence as a service
 * pay-per-call API for agent network data
 */

import { config } from "dotenv";
import express from "express";
import { paymentMiddleware } from "x402-express";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config();

const facilitatorUrl = process.env.FACILITATOR_URL || "https://facilitator.openx402.ai";
const payTo = process.env.PAY_TO_ADDRESS || "0x9FffCdb0bB65Ac66D20179A4874fD965F1b1b2be";
const port = process.env.PORT || 4021;

const app = express();
app.use(express.json());

// x402 payment middleware
app.use(paymentMiddleware(
  payTo,
  {
    // network intelligence report - comprehensive network data
    "GET /network/report": {
      price: "$0.25",
      network: "base",
    },
    // agent lookup - specific agent details
    "GET /agent/:name": {
      price: "$0.10",
      network: "base",
    },
    // treasury analysis - fuel metrics for any agent
    "GET /treasury/:address": {
      price: "$0.15",
      network: "base",
    },
    // connection recommendations - who should meet who
    "GET /connections/recommend": {
      price: "$0.20",
      network: "base",
    },
  },
  { url: facilitatorUrl }
));

// load network data
async function loadNetworkData() {
  try {
    const data = await readFile(join(__dirname, "../memory/state.json"), "utf8");
    return JSON.parse(data);
  } catch (e) {
    return { agents: [], lastUpdated: null };
  }
}

// load visitors/connections data
async function loadVisitorsData() {
  try {
    const data = await readFile(join(__dirname, "../memory/visitors.json"), "utf8");
    return JSON.parse(data);
  } catch (e) {
    return { visitors: {} };
  }
}

// GET /network/report - full network intelligence
app.get("/network/report", async (req, res) => {
  const network = await loadNetworkData();
  const visitors = await loadVisitorsData();
  
  const report = {
    generatedAt: new Date().toISOString(),
    generatedBy: "mycel",
    summary: {
      totalAgents: network.agents?.length || 0,
      activeConnections: Object.keys(visitors.visitors || {}).length,
      networkAge: "1 day", // since mycel launched
    },
    agents: network.agents || [],
    connections: visitors.visitors || {},
    opportunities: [
      "daimon111 has $15K in claimable fees seeking allocation",
      "Crusty Macx demonstrates viable x402 revenue model",
      "Conway Research community has multiple automatons",
      "todd-flanders dashboard needs data feeds",
    ],
    fuelMetrics: {
      mycelRunway: "~112 days",
      mycelDailyCost: "$0.34",
      targetRevenue: "$0.50/day",
      currentRevenue: "$0",
    },
  };
  
  res.json(report);
});

// GET /agent/:name - specific agent details
app.get("/agent/:name", async (req, res) => {
  const { name } = req.params;
  const network = await loadNetworkData();
  const visitors = await loadVisitorsData();
  
  const agent = network.agents?.find(a => 
    a.name?.toLowerCase() === name.toLowerCase() ||
    a.handle?.toLowerCase() === name.toLowerCase()
  );
  
  const connection = visitors.visitors?.[name.toLowerCase()];
  
  if (!agent && !connection) {
    return res.status(404).json({ error: "Agent not found" });
  }
  
  res.json({
    agent,
    connection,
    lastUpdated: new Date().toISOString(),
  });
});

// GET /treasury/:address - treasury analysis (placeholder)
app.get("/treasury/:address", async (req, res) => {
  const { address } = req.params;
  
  // this would integrate with onchain data in production
  res.json({
    address,
    analysis: "Treasury analysis requires onchain integration",
    note: "coming soon - will analyze ETH, USDC, token balances",
    generatedAt: new Date().toISOString(),
  });
});

// GET /connections/recommend - who should meet who
app.get("/connections/recommend", async (req, res) => {
  const recommendations = [
    {
      from: "daimon111",
      to: "Crusty Macx",
      reason: "treasury allocation + x402 expertise",
      value: "daimon111 needs revenue models, Crusty has proven x402 setup",
    },
    {
      from: "todd-flanders",
      to: "mycel",
      reason: "dashboard + network data",
      value: "todd's dashboard needs data feeds, mycel generates network intel",
    },
    {
      from: "Conway Research",
      to: "daimon111",
      reason: "community + coordination",
      value: "Conway has multiple automatons, daimon111 coordinates network",
    },
  ];
  
  res.json({
    generatedAt: new Date().toISOString(),
    recommendations,
  });
});

// health check (free)
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    service: "mycel-gateway",
    version: "0.1.0",
  });
});

app.listen(port, () => {
  console.log(`mycel x402 gateway listening on port ${port}`);
  console.log(`receiving payments to: ${payTo}`);
  console.log(`facilitator: ${facilitatorUrl}`);
  console.log("\nendpoints:");
  console.log("  GET /health - health check (free)");
  console.log("  GET /network/report - full network intel ($0.25)");
  console.log("  GET /agent/:name - agent details ($0.10)");
  console.log("  GET /treasury/:address - treasury analysis ($0.15)");
  console.log("  GET /connections/recommend - connection recs ($0.20)");
});
