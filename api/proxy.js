const url = require("url");
const protocols = {
  http: require("http"),
  https: require("https"),
};

module.exports = (endpoint, opts, key) => {
  return function simpleHttpProxy(req, res, next) {
    // Get our forwarding info
    let hostInfo = req.headers.host.split(":");
    const parsedUrl = url.parse(endpoint);
    // Remove the host header
    delete req.headers.host;

    // Resolve the url
    let path = parsedUrl.pathname + (req.url === "/" ? "" : req.url);

    // Setup the options
    let options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      headers: req.headers,
      path: path,
      method: req.method,
    };
    console.log(options);
    // Enable forwarding headers
    // Get the path at which the middleware is mounted
    let resPath = req.originalUrl.replace(req.url, "").split("?")[0];

    // We'll need to add a / if it's not on there
    if (resPath.indexOf("/") !== 0) resPath = "/" + resPath;

    // Pass along our headers
    options.headers["Authorization"] = 'Bearer ' + process.env.API_TOKEN;
    options.headers["Content-type"] = "application/json";

    // Make the request with the correct protocol
    let request = protocols[
      (parsedUrl.protocol || "http").replace(":", "")
    ].request(options, function (response) {
      console.log(options);
      // The headers have already been sent so we can't actually respond to this request
      if (res.headersSent) {
        res.end();
        return request.abort();
      }

      // Send down the statusCode and headers

      // allow the caller to override the default pipe behavior

      res.writeHead(response.statusCode, response.headers);

      // Pipe the response

      response.pipe(res);
    });

    // Handle any timeouts that occur

    request.setTimeout(10000, function () {
      // Clean up the socket
      request.setSocketKeepAlive(false);
      request.socket.destroy();

      // Mark this as a gateway timeout
      res.status(504);
      next(new Error('Proxy to "' + endpoint + '" timed out'));
    });

    // Pipe the client request upstream
    req.pipe(request);

    // Pass on our errors
    request.on("error", next);
  };
};
