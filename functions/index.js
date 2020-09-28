const functions = require('firebase-functions');
const admin = require('firebase-admin');

const express = require('express');
const app = express();

app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  res.render('main', {activePage: "Home"});
});

const tags = {"politics": "Politics", "environment": "Environment", "covid": "COVID-19", "demographics": "Demographics"};
const authors = {"author_one": "Author One"};

function getActivePage(category){
  if(category in tags){
    return tags[category];
  }else if(category in authors){
      return "Home";
  }
}

app.get('/article', (req, res) => {
  res.render('article', {
    activePage: "Home"
  });
});

app.get('/:category', (req, res) => {
  let category = req.params.category;
  res.render('main', {
    activePage: getActivePage(category)
  });


});



exports.app = functions.https.onRequest(app);