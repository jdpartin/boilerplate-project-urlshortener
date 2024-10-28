require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

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

// URL Shortener
const shortUrls = [];

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

const dns = require('dns');
const urlParser = require('url');

app.post('/api/shorturl/', (req, res) => {
  const originalUrl = req.body.url;
  let parsedUrl;

  try
  {
    parsedUrl = new URL(originalUrl);
  } 
  catch (err)
  {
    return res.json({ error: 'invalid url' });
  }

  dns.lookup(parsedUrl.hostname, (err) => {
    if (err)
    {
      return res.json({ error: 'invalid url' });
    }

    const shortUrlId = getShortUrl(parsedUrl);

    res.json({ original_url: originalUrl, short_url: shortUrlId });
  });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrlId = req.params.short_url;
  
  const originalUrl = shortUrls[parseInt(shortUrlId)];
  
  if (originalUrl)
  {
    res.redirect(originalUrl);
  }
  else
  {
    res.json({ error: 'No short URL found' });
  }
});

function getShortUrl(url)
{
  shortUrls.push(url);
  return shortUrls.length - 1;// The index is the id
}

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
