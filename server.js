const fs = require('fs');
const path = require('path');
const url = require('url');
var httpServer = require('http');

var express = require('express');
var app = express();
 
const ioServer = require('socket.io');
const RTCServer = require('./Signaling.js');

var PORT = 9558;
var isUseHTTPs = true;

var config = {
    "socketURL": "/",
    "homePage": "/index.html",
};

var options = {
    key: fs.readFileSync('ssl/key.pem'),
    cert: fs.readFileSync('ssl/cert.pem')
};

function serverHandler(request, response) {
}

app.use(express.static(path.join(__dirname, 'public')));
var httpApp;
if (isUseHTTPs) {
    httpServer = require('https');
    httpApp = httpServer.createServer(options, app);  // , serverHandler);
} else {
    httpApp = httpServer.createServer(app); // serverHandler);
}

httpApp = httpApp.listen(process.env.PORT || PORT, process.env.IP || "0.0.0.0", function () {
	var addr = httpApp.address();
    console.log("Server listening at", /*addr.address*/ "localhost" + ":" + addr.port);
});

ioServer(httpApp).on('connection', function(socket) {
    RTCServer(socket, config);
});

// 捕获全局异常
process.on('uncaughtException', (err, origin) => {
  fs.writeSync(
    process.stderr.fd,
    `捕获的异常: ${err}\n` +
    `异常的来源: ${origin}`
  );
});

