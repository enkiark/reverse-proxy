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
app.use("/another-path", proxy(process.env.API_URL2));
