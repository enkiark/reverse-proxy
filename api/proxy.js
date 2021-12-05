const url = require("url");
const https = require("https");

module.exports = (endpoint) => {
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

    // Pass along our headers
    // options.headers["Authorization"] = 'Bearer ' + process.env.API_TOKEN;
    // options.headers["Content-type"] = "application/json";

    // Make the request with the correct protocol
    let request = https.request(options, function (response) {
      // The headers have already been sent so we can't actually respond to this request
      if (res.headersSent) {
        res.end();
        return request.abort();
      }

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
