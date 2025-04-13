const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();

// Enable CORS for all routes
app.use(cors());

// Get target URL from environment variable or use default
const DEFAULT_TARGET_URL = "https://backend.svg.io";

// Create proxy middleware with dynamic target
const createProxy = (targetUrl) =>
  createProxyMiddleware({
    target: targetUrl,
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

// Default proxy route
app.use("/", createProxy(DEFAULT_TARGET_URL));

// Dynamic target route
app.use("/target/:encodedUrl", (req, res, next) => {
  try {
    const targetUrl = decodeURIComponent(req.params.encodedUrl);
    // Validate URL
    new URL(targetUrl);
    // Create and use proxy for this specific request
    createProxy(targetUrl)(req, res, next);
  } catch (error) {
    res.status(400).send("Invalid URL");
  }
});

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
