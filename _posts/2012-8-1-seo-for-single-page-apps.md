---
layout: post
title: SEO for single page applications
type: intermediate
posturl: http://backbonetutorials.com/seo-for-single-page-apps
---

# SEO for single page apps

This tutorial will show you how to index your application on search engines.   As the author I believe that servers should be completely independent of the client in the age of API's.  Which speeds up development for the ever increasing array of clients.   It is on the shoulders of the search engines to conform and they should not dictate how the web is stored and accessed.

In 2009 Google released the idea of [escaped fragments](http://googlewebmastercentral.blogspot.com.au/2009/10/proposal-for-making-ajax-crawlable.html).   

The idea simply stating that if a search engine should come across your JavaScript application then you have the permission to redirect the search engine to another URL that serves the fully rendered version of the page (The current search engines cannot execute much JavaScript (Some people speculate that Google Chrome was born of Google Search wishing to successfully render every web page to retrieve ajaxed content)).

## How does redirecting bots work?

Using modern headless browsers, we can easily return the fully rendered content per request by redirecting bots using our web servers configuration.   Here is an image made by Google depicting the setup.

![headless seo](http://acris.googlecode.com/svn/wiki/images/seo_google_crawlability.png)

<div style='clear: both;'></div>

## Implementation using Phantom.js

[Phantom.js](http://phantomjs.org/) is a headless webkit browser.  We are going to setup a node.js server that given a URL, it will fully render the page content. Then we will redirect bots to this server to retrieve the correct content.

You will need to install node.js and phantom.js onto a box. Then start up this server below. There are two files, one which is the web server and the other is a phantomjs script that renders the page.

```js
// web.js

// Express is our web server that can handle request
var express = require('express');
var app = express();


var getContent = function(url, callback) {
  var content = '';
  // Here we spawn a phantom.js process, the first element of the 
  // array is our phantomjs script and the second element is our url 
  var phantom = require('child_process').spawn('phantomjs', ['phantom-server.js', url]);
  phantom.stdout.setEncoding('utf8');
  // Our phantom.js script is simply logging the output and
  // we access it here through stdout
  phantom.stdout.on('data', function(data) {
    content += data.toString();
  });
  phantom.on('exit', function(code) {
    if (code !== 0) {
      console.log('We have an error');
    } else {
      // once our phantom.js script exits, let's call out call back
      // which outputs the contents to the page
      callback(content);
    }
  });
};

var respond = function (req, res) {
  // Because we use [P] in htaccess we have access to this header
  url = 'http://' + req.headers['x-forwarded-host'] + req.params[0];
  getContent(url, function (content) {
    res.send(content);
  });
}

app.get(/(.*)/, respond);
app.listen(3000);
```

The script below is `phantom-server.js` and will be in charge of fully rendering the content. We don't return the content  until the page is fully rendered. We hook into the resources listener to do this.

{% highlight javascript %}
var page = require('webpage').create();
var system = require('system');

var lastReceived = new Date().getTime();
var requestCount = 0;
var responseCount = 0;
var requestIds = [];
var startTime = new Date().getTime();

page.onResourceReceived = function (response) {
    if(requestIds.indexOf(response.id) !== -1) {
        lastReceived = new Date().getTime();
        responseCount++;
        requestIds[requestIds.indexOf(response.id)] = null;
    }
};
page.onResourceRequested = function (request) {
    if(requestIds.indexOf(request.id) === -1) {
        requestIds.push(request.id);
        requestCount++;
    }
};

// Open the page
page.open(system.args[1], function () {});

var checkComplete = function () {
  // We don't allow it to take longer than 5 seconds but
  // don't return until all requests are finished
  if((new Date().getTime() - lastReceived > 300 && requestCount === responseCount) || new Date().getTime() - startTime > 5000)  {
    clearInterval(checkCompleteInterval);
    console.log(page.content);
    phantom.exit();
  }
}
// Let us check to see if the page is finished rendering
var checkCompleteInterval = setInterval(checkComplete, 1);
{% endhighlight %}

Once we have this server up and running we just redirect bots to the server in our client's web server configuration.

## Redirecting bots

If you are using apache we can edit out `.htaccess` such that Google requests are proxied to our middle man phantom.js server.

{% highlight javascript %}
RewriteEngine on
RewriteCond %{QUERY_STRING} ^_escaped_fragment_=(.*)$
RewriteRule (.*) http://webserver:3000/%1? [P]
{% endhighlight %}

We could also include other `RewriteCond`, such as `user agent` to redirect other search engines we wish to be indexed on.


Though Google won't use `_escaped_fragment_` unless we tell it to by either including a meta tag;
`<meta name="fragment" content="!">`
or
using `#!` URLs in our links.

You will most likely have to use both.

I have released an open source npm package called [seo server](http://seo.apiengine.io) for anyone wanting to jump straight in.

This has been tested with Google Webmasters fetch tool.  Make sure you include `#!` on your URLs when using the fetch tool.

### Relevant Links

* [Open source node.js Seo Server](http://seo.apiengine.io)
