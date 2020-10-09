const functions = require('firebase-functions');
const admin = require('firebase-admin');

const express = require('express');
const app = express();
app.set('view engine', 'ejs');

const serviceAccount = require('./serviceAccount.json');

const moment = require('moment');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://stanford-data-journalism.firebaseio.com"
});


app.get('/', (req, res) => {
  res.render('main', {activePage: "Home"});
});

const tagNames = {"politics": "Politics", "environment": "Environment", "covid": "COVID-19", "demographics": "Demographics"};
const authors = {"author_one": "Author One"};

function getActivePage(category){
  if(category in tagNames){
    return tagNames[category];
  }else if(category in authors){
      return "Home";
  }
}

app.get('/:category', (req, res, next) => {
  let category = req.params.category;

  if(category in tagNames || category in authors){
    res.render('main', {
      activePage: getActivePage(category)
    });
  }else {
    next();
  }
});

app.get('/:article', (req, res, next) => {
  let id = req.params.article;

  admin.firestore().collection("articles").doc(id).get().then(snap => {
    let article = snap.data();
    let time = new moment(article.timestamp.seconds*1000);
    let author_id = article.author.toLowerCase().split().join("_");
    let tags = article.tags.map(tag => {
      console.log(tagNames[tag]);
      return {tagID: tagNames[tag], tagName: tag}});

    res.render('article', {
      title: article.title,
      subtitle: article.subtitle,
      image: article.image,
      date: time.format('MMMM Do, YYYY'),
      author: article.author,
      author_id: author_id,
      tags: tags,
      text: article.text
    });

  }).catch((err) => {
    console.log(err);
    next();
  })
});

app.get('*', (req, res) => {
  res.render('404');
});





exports.app = functions.https.onRequest(app);