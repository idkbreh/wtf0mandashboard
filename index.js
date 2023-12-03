require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fsPromises = require('fs').promises;
const fs = require('fs');
const ejs = require('ejs')
const app = express();
const port = process.env.PORT || 80;
// SETTING APP PULIC AND VIEWS
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine','ejs')
app.set('views', __dirname + '/views');
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
// IMPORT PAGE & API
const ConsolePage = require("./api/console");
const IndexPage = require("./api/IndexPage");
const ScriptPage = require('./api/scriptrender')
// const console = require('./routes/consoleAPI');

// app.use('/api', consoleAPI);
app.get('/api/loadingpages',ScriptPage)
app.post('/receive', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    const serverName = req.body.cookies;
    const htmlContent = req.body.html;
    const styles = req.body.styles;
    const js = req.body.js;

    if (htmlContent !== undefined && htmlContent.trim() !== '') {
        try {
            await fsPromises.writeFile(`public/${serverName}.html`, htmlContent);
            await fsPromises.writeFile(`public/${serverName}.css`, styles);
            await fsPromises.writeFile(`public/${serverName}.js`, js);
            console.log(htmlContent);
        } catch (error) {
            console.error('Error writing files: Some file won\'t load');
        }
    } else {
        console.error('Content is Empty !');
    }

    console.log(`Data received for Cookie set: ${serverName}`);
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
