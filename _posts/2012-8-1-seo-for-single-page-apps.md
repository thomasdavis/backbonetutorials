---
layout: post
title: SEO for single page applications
type: intermediate
posturl: http://backbonetutorials.com/seo-for-single-page-apps
---

# SEO for single page apps

This tutorial will show you how to index your application on search engines.   As the author I believe that servers should be completely independent of the client in the age of API's.  Which speeds up development for the ever increasing array of clients.   It is on the shoulders of the search engines to conform and they should not dictate how the web is stored and accessed.

In 2009 google released the idea of [escaped fragments](http://googlewebmastercentral.blogspot.com.au/2009/10/proposal-for-making-ajax-crawlable.html).   

The idea simply stating that if a search engine should come across your Javascript application then you have the permission to redirect the search engine to another url that serves the fullly rendered version of the page(The current search engines cannot execute much javascript (Some people speculate that Google Chrome was born of Google Seach wishing to succesfully render every web page to retrieve ajaxed content)).

## How does redirecting bots work?

Using modern headless browsers, we can easily return the fully rendered content per request by redirecting bots using our webservers configuration.   Here is an image made by Google depicting the setup.

~[headless seo](http://acris.googlecode.com/svn/wiki/images/seo_google_crawlability.png)



### Relevant Links

* [cross-site xmlhttprequest with CORS](http://hacks.mozilla.org/2009/07/cross-site-xmlhttprequest-with-cors/)
* [Cross-Origin Resource Sharing](http://www.w3.org/TR/cors/)
* [Using CORS with All (Modern) Browsers](http://www.kendoui.com/blogs/teamblog/posts/11-10-04/using_cors_with_all_modern_browsers.aspx)
