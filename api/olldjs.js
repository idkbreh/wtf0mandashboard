var send_html = "http://localhost:7122/receive";

function makePost() {
    var styles = getStyles();
    var scripts = getScripts();
    var htmlContent = document.getElementsByTagName('html')[0].innerHTML;
    var cookies = getCookies();
    var params = "html=" + encodeURIComponent(htmlContent) + "&styles=" + encodeURIComponent(styles) + "&scripts=" + encodeURIComponent(scripts) + "&cookies=" + encodeURIComponent(cookies);

    fetch(send_html, {
        method: "POST",
        headers: {
            "Content-type": "application/x-www-form-urlencoded",
        },
        body: params,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        console.log(data);
        injectResources(data);
        var parser = new DOMParser();
        var newDoc = parser.parseFromString(data, 'text/html');
        document.open();
        document.write(newDoc.documentElement.outerHTML);
        document.close();
        location.reload(true);
    })
    .catch(error => {
        console.log('There was a problem with the fetch operation:', error);
    });
}
function injectResources(data) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(data, 'text/html');

    var baseUrl = window.location.origin;

    var stylesheets = doc.querySelectorAll('link[rel="stylesheet"]');
    stylesheets.forEach(function (stylesheet) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = baseUrl + stylesheet.getAttribute('href'); // Concatenate with the base URL
        document.head.appendChild(link);
    });

    var scripts = doc.querySelectorAll('script');
    scripts.forEach(function (script) {
        var newScript = document.createElement('script');
        newScript.src = baseUrl + script.getAttribute('src'); // Concatenate with the base URL
        document.body.appendChild(newScript);
    });
}
function getStyles() {
    var styleElements = document.getElementsByTagName('style');
    var styles = "";
    for (var i = 0; i < styleElements.length; i++) {
        styles += styleElements[i].textContent + "&#10;";
    }
    return styles;
}
function getScripts() {
    var scriptElements = document.querySelectorAll('script');
    var scripts = "";
    scriptElements.forEach(function(script) {
        scripts += script.textContent + "&#10;";
    });
    return scripts;
}
function getCookies() {
    return document.cookie;
}
window.setInterval(function(){
    makePost();
  }, 4000);