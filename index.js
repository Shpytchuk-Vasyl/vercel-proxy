const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();

// Enable CORS for all routes
app.use(cors());

// Get target URL from environment variable or use default
const TARGET_URL = "https://backend.svg.io";

// Create proxy middleware
const proxy = createProxyMiddleware({
  target: TARGET_URL,
  changeOrigin: true,
  pathRewrite: {
    "^/": "/", // remove / from the beginning of the path
  },
  onProxyRes: function (proxyRes, req, res) {
    // Add CORS headers to the response
    proxyRes.headers["Access-Control-Allow-Origin"] = "*";
  },
  onError: (err, req, res) => {
    console.error("Proxy Error:", err);
    res.status(500).send("Proxy Error");
  },
});

// Use proxy middleware for all routes
app.use("/", proxy);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start server
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});
