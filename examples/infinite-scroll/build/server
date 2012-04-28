var fs = require("fs");
var express = require("express");
var site = express.createServer();

site.use(express.static(__dirname + '/..'));

site.use(express.favicon("./favicon.ico"));

site.get("*", function(req, res) {
  fs.createReadStream("./index.html").pipe(res);
});

site.listen(1337);

console.log("Server listening on http://localhost:1337");
