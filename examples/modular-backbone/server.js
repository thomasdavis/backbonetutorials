var express = require('express'),
    app    = express.createServer(),
    port   = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.listen(port, function () {
    console.log('Server listening on ' + port);
});