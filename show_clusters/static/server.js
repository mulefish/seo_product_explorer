const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3030;
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
  });
app.get('/logic.js', function(req, res) {
  res.sendFile(path.join(__dirname, '/logic.js'));
});
app.get('/cluster_output.txt', function(req, res) {
  res.sendFile(path.join(__dirname, '/cluster_output.txt'));
});
app.get('/product_output.txt', function(req, res) {
  res.sendFile(path.join(__dirname, '/product_output.txt'));
});
app.get('/colorFinder.js', function(req, res) {
  res.sendFile(path.join(__dirname, '/colorFinder.js'));
});




app.listen(port);
console.log('Server started at http://localhost:' + port);
