const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();

// Enable CORS for all routes
app.use(cors());

// Get target URL from environment variable or use default
const DEFAULT_TARGET_URL = "https://backend.svg.io";

// Create proxy middleware with dynamic target
const createProxy = (targetUrl) => {
  return createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    pathRewrite: {
      "^/": "/", // remove / from the beginning of the path
    },
    onProxyRes: (proxyRes, req, res) => {
      // Add CORS headers to the response
      proxyRes.headers["Access-Control-Allow-Origin"] = "*";
    },
    onError: (err, req, res) => {
      console.error("Proxy Error:", err);
      res.status(500).send("Proxy Error");
    },
  });
};

// Default proxy route
app.use("/", createProxy(DEFAULT_TARGET_URL));

// Dynamic target route - using wildcard to capture everything after /target/
app.use("/target/*", (req, res, next) => {
  try {
    // Get everything after /target/
    const encodedUrl = req.params[0];
    console.log("Encoded URL:", encodedUrl);

    const targetUrl = decodeURIComponent(encodedUrl);
    console.log("Decoded URL:", targetUrl);

    // Validate URL
    new URL(targetUrl);
    // Create and use proxy for this specific request
    createProxy(targetUrl)(req, res, next);
  } catch (error) {
    console.error("Error processing URL:", error);
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
