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
app.use("/api", proxy(process.env.API_URL));
