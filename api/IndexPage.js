module.exports = (req,res) => {
    const path = require('path');
    const fs = require('fs');
    require('dotenv').config();
    const publicFolderPath = path.join(__dirname, '../public'); // Adjust the path as needed
    const fileNames = fs.readdirSync(publicFolderPath).filter(file => file.endsWith('.html'));
    res.render('main.ejs',{ fileNames , site:process.env.URL_SITE})
}