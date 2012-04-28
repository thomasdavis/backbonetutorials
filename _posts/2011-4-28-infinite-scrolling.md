---
layout: post
title: Lightweight Infinite Scrolling using Twitter API
type: intermediate
posturl: http://backbonetutorials.com/infinite-scroll
---

# Lightweight Infinite Scrolling using Twitter API


The first thing to do is require the Restify module. Restify will be in control of handling our restFul end points and returning the appropriate JSON.


    var restify = require('restify');  
    var server = restify.createServer();
    server.use(restify.bodyParser());
