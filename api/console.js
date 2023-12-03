module.exports = (req,res) => {
    function removeHtmlExtension(fileName) {
        return fileName.replace('.html', '');
    }
    var serverID = removeHtmlExtension(req.query.server)
    res.render('console.ejs',{
        server:serverID
    })
}