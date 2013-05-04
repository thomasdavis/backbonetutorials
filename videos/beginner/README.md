# Backbone.js Beginner Video Tutorial

## Links

* [Link to client repo](https://github.com/thomasdavis/backbonetutorials/tree/gh-pages/videos/beginner)
* [Link to server repo](https://github.com/thomasdavis/video-backbone-beginner-server)
* [cdnjs](http://cdnjs.com)
* [My homepage](http://thomasdav.is)

## Example RESTful Documentation

A deployed CORS enabled version of this server is available at

`http://backbonejs-beginner.herokuapp.com`

The server code base can be found [here](https://github.com/thomasdavis/video-backbone-beginner-server).

The example runs against this server which exposes the API shown below

Used for populating our users collection

**GET** /users - _Returns an array of user objects e.g. `[{firstname: 'Thomas', lastname: 'Davis', age: 12}]`_

Used for populating our user model

**GET** /users/:id - _Returns a single user object e.g. `{id: 'xxxx', firstname: 'Thomas', lastname: 'Davis', age: 12}`

**POST** /users - _Creates a user based off the payload and returns the new user object e.g. `{id: 'xxxx', firstname: 'Thomas', lastname: 'Davis', age: 12}`_

**PUT** /users/:id - _Updates the given user with the given payload and returns the newly updated user object_

**DELETE** /users/:id - _Deletes the given user from the server_

## Extra Snippets

### Ajax Prefilter

Ajax prefilters are useful for hooking into all AJAX request. In this case, we want to send all our AJAX request off to a remote server instead of the same domain. So we use a prefilter to hook in before the request is sent and prepend our custom origin server.

```js
$.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
  options.url = 'http://backbonejs-beginner.herokuapp.com' + options.url;
});
```

### jQuery SerializeObject

By default jQuery doesn't allow us to convert our forms into Javascript Objects, someone wrote this snippet on Stack Overflow that I have been using for years.   Simply call it via `$(form).serializeObject()` and get a object returned.

```js
$.fn.serializeObject = function() {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
      if (o[this.name] !== undefined) {
          if (!o[this.name].push) {
              o[this.name] = [o[this.name]];
          }
          o[this.name].push(this.value || '');
      } else {
          o[this.name] = this.value || '';
      }
  });
  return o;
};
```  

### Preventing XSS

As always you need to protect your users by encoding input and output, here is some simple methods for doing so.

```js
function htmlEncode(value){
  return $('<div/>').text(value).html();
}

function htmlDecode(value){
  return $('<div/>').html(value).text();
}
```
