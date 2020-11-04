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

const db = admin.firestore();

async function getArticles(category){
  return new Promise(async (resolve, reject) => {
    try {
      let snap = await db.collection('articles').where('tags', 'array-contains', category).get();
      
      snap.forEach((doc) => {
        console.log(doc.exists);

        let articleData = doc.data();

        let time = new moment(articleData.timestamp.seconds*1000);
        let timeDisplay = time.format('MMMM Do, YYYY')
        let author_id = articleData.author.toLowerCase().split().join("_");
        let tags = articleData.tags.map(tag => {
        if(tag in tagNames){
          return {tagID: tag, tagName: tagNames[tag]};
        }else{
          return false;
        }
        });
        let article = articleData;
        article.date = timeDisplay;
        article.author_id = author_id;
        article.tags = tags;
        console.log(doc.id);
        article.id = doc.id;
        resolve(article);
      });
    }catch(err){
      reject(err);
    }
    
  });
}


app.get('/', async (req, res, next) => {
  try {
    let featureData = await getArticles('main-feature');
    
    res.render('main', {
      activePage: "Home",
      feature: featureData
    });
  } catch (err) {
    console.log(err);
    next();
  }
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

app.get('/:category', async (req, res, next) => {
  let category = req.params.category;

  if(category in tagNames || category in authors){
    let featureTag = category + "-feature";
    let feature = await getArticles(featureTag);
    res.render('main', {
      activePage: getActivePage(category),
      feature: feature
    });
  }else {
    next();
  }
});

app.get('/:article', (req, res, next) => {
  let id = req.params.article;

  db.collection("articles").doc(id).get().then(snap => {
    let article = snap.data();
    let time = new moment(article.timestamp.seconds*1000);
    let author_id = article.author.toLowerCase().split().join("_");
    let tags = article.tags.map(tag => {
      if(tag in tagNames){
        return {tagID: tag, tagName: tagNames[tag]};
      }else{
        return false;
      }
    });

    res.render('article', {
      title: article.title,
      subtitle: article.subtitle,
      image_desktop: article.image,
      image_mobile: article.image_mobile,
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