'use strict';

var express = require('express');
var path = require('path');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/index.html'));
});

app.listen(3000, function () {
  console.warn('Livetask client listening on port 3000 !');
});
//# sourceMappingURL=index.js.map