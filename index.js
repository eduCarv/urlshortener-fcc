require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const arrayUrls = [];

app.post('/api/shorturl', (req, res) => {
  let url = new URL(req.body.url);
  let originalUrl = req.body.url;
  const shortUrl = Math.floor(Math.random() * 1000);

  if (url.protocol === "ftp:") {
      res.json({
        error: "invalid url",
      });
    return false;
  } else {
    arrayUrls.push({url: url, shorturl: shortUrl});    
  }
  
  // console.log(arrayUrls);  

  res.json({
    original_url: url,
    short_url: shortUrl,
  });
});

app.get('/api/shorturl/:urllink', (req, res) => {
  const enderecoCompleto = req.protocol + '://' + req.get('host') + req.originalUrl;

  const shortUrlToFind = req.params.urllink;
  const filteredUrls = arrayUrls.filter(obj => obj.shorturl == shortUrlToFind);

  console.log('originalURL', enderecoCompleto);
  
  const httpRegex = /^(http|https)(:\/\/)/; if (!httpRegex.test(enderecoCompleto)) {return res.json({ error: 'invalid url' })}


  console.log('a encontrar', shortUrlToFind);
  
  if(filteredUrls.length <= 0) {
    console.log('pei');
    res.json({
      error: 'invalid url'
    });
  } else {
    console.log('dei');  
    res.status(302).redirect(filteredUrls[0].url);              
  }
  
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
