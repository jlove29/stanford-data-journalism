const functions = require('firebase-functions');
const admin = require('firebase-admin');

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.render('main');
});

exports.app = functions.https.onRequest(app);