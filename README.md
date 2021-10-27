# Reverse-proxy API middleware

A small reverse proxy API middleware for [Vercel](https://vercel.com/) Serverless Functions lands.
Often used in combination with Vercel frontend apps.

## Usage

1. Add the destination API URLs and/or Tokens as [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables) in the Vercel dashboard during build. API_TOKEN, API_URL etc.
2. Create one .js file for every proxy API endpoint you would like to add. i.e. for /api/path create an /api/path.js file
3. Add any additional headers in the proxy.js file
4. Add the following to path.js
 ```js
/**
 * Module dependencies
 */
const express = require("express");
const proxy = require("./proxy");

/**
 * Expose the app
 */
const app = (module.exports = express());

/**
 * Mount the proxy middleware
 */
app.use("/api/path", proxy(process.env.API_URL));
   ```

5. Make the request to `https://your-vercel-domain/api/path` to reach the ***https://destination-API-endpoint/***


## Credits

Inspired by [simple-http-proxy](https://github.com/simple-app/simple-http-proxy).
