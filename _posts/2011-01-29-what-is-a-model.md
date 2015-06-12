---
layout: post
title: What is a model?
type: beginner
posturl: http://backbonetutorials.com/what-is-a-model
---

# What is a model?

Across the internet the definition of [MVC](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) is so diluted that it's hard to tell what exactly your model should be doing.   The authors of backbone.js have quite a clear definition of what they believe the model represents in backbone.js.

> Models are the heart of any JavaScript application, containing the interactive data as well as a large part of the logic surrounding it: conversions, validations, computed properties, and access control.

So for the purpose of the tutorial let's create a model.

```js
    var Person = Backbone.Model.extend({
        initialize: function(){
            alert("Welcome to this world");
        }
    });
    
    var person = new Person;
```

So _initialize()_ is triggered whenever you create a new instance of a model( models, collections and views work the same way ).   You don't have to include it in your model declaration but you will find yourself using it more often than not.

## Setting attributes

Now we want to pass some parameters when we create an instance of our model.

{% highlight javascript %}
    Person = Backbone.Model.extend({
        initialize: function(){
            alert("Welcome to this world");
        }
    });
    
    var person = new Person({ name: "Thomas", age: 67});
    // or we can set afterwards, these operations are equivalent
    var person = new Person();
    person.set({ name: "Thomas", age: 67});
    
{% endhighlight %}

So passing a JavaScript object to our constructor is the same as calling _model.set()_.   Now that these models have attributes set we need to be able to retrieve them.  

## Getting attributes

Using the _model.get()_ method we can access model properties at anytime.

{% highlight javascript %}
    Person = Backbone.Model.extend({
        initialize: function(){
            alert("Welcome to this world");
        }
    });
    
    var person = new Person({ name: "Thomas", age: 67, child: 'Ryan'});
    
    var age = person.get("age"); // 67
    var name = person.get("name"); // "Thomas"
    var child = person.get("child"); // 'Ryan'
    
{% endhighlight %}

## Setting model defaults

Sometimes you will want your model to contain default values.   This can easily be accomplished by setting a property name 'defaults' in your model declaration.

{% highlight javascript %}
    Person = Backbone.Model.extend({
        defaults: {
            name: 'Fetus',
            age: 0,
            child: ''
        },
        initialize: function(){
            alert("Welcome to this world");
        }
    });
    
    var person = new Person({ name: "Thomas", age: 67, child: 'Ryan'});
    
    var age = person.get("age"); // 67
    var name = person.get("name"); // "Thomas"
    var child = person.get("child"); // 'Ryan'
    
{% endhighlight %}

## Manipulating model attributes

Models can contain as many custom methods as you like to manipulate attributes.   By default all methods are public.

{% highlight javascript %}
    Person = Backbone.Model.extend({
        defaults: {
            name: 'Fetus',
            age: 0,
            child: ''
        },
        initialize: function(){
            alert("Welcome to this world");
        },
        adopt: function( newChildsName ){
            this.set({ child: newChildsName });
        }
    });
    
    var person = new Person({ name: "Thomas", age: 67, child: 'Ryan'});
    person.adopt('John Resig');
    var child = person.get("child"); // 'John Resig'
    
{% endhighlight %}

So we can implement methods to get/set and perform other calculations using attributes from our model at any time.   

## Listening for changes to the model

Now onto one of the more useful parts of using a library such as backbone.   All attributes of a model can have listeners bound to them to detect changes to their values.   In our initialize function we are going to bind a function call everytime we change the value of our attribute.   In this case if the name of our "person" changes we will alert their new name.

{% highlight javascript %}
    Person = Backbone.Model.extend({
        defaults: {
            name: 'Fetus',
            age: 0
        },
        initialize: function(){
            alert("Welcome to this world");
            this.on("change:name", function(model){
                var name = model.get("name"); // 'Stewie Griffin'
                alert("Changed my name to " + name );
            });
        }
    });
    
    var person = new Person({ name: "Thomas", age: 67});
    person.set({name: 'Stewie Griffin'}); // This triggers a change and will alert()
{% endhighlight %}

So we can bind the change listener to individual attributes or if we like simply '_this.on("change", function(model){});_' to listen for changes to all attributes of the model.

## Interacting with the server

Models are used to represent data from your server and actions you perform on them will be translated to RESTful operations.

The `id` attribute of a model identifies how to find it on the database usually mapping to the [surrogate key](http://en.wikipedia.org/wiki/Surrogate_key).

For the purpose of this tutorial imagine that we have a mysql table called `Users` with the columns `id`, `name`, `email`.

The server has implemented a RESTful URL `/user` which allows us to interact with it.

Our model definition shall thus look like;

{% highlight javascript %}
    var UserModel = Backbone.Model.extend({
        urlRoot: '/user',
        defaults: {
            name: '',
            email: ''
        }

    });
{% endhighlight %}

### Creating a new model

If we wish to create a new user on the server then we will instantiate a new UserModel and call `save`.  If the `id` attribute of the model is `null`, Backbone.js will send a POST request to the urlRoot of the server. 

{% highlight javascript %}
    var UserModel = Backbone.Model.extend({
        urlRoot: '/user',
        defaults: {
            name: '',
            email: ''
        }
    });
    var user = new UserModel();
    // Notice that we haven't set an `id`
    var userDetails = {
        name: 'Thomas',
        email: 'thomasalwyndavis@gmail.com'
    };
    // Because we have not set a `id` the server will call
    // POST /user with a payload of {name:'Thomas', email: 'thomasalwyndavis@gmail.com'}
    // The server should save the data and return a response containing the new `id`
    user.save(userDetails, {
        success: function (user) {
            alert(user.toJSON());
        }
    })

{% endhighlight %}

Our table should now have the values

1, 'Thomas', 'thomasalwyndavis@gmail.com'

### Getting a model

Now that we have saved a new user model, we can retrieve it from the server.   We know that the `id` is 1 from the above example.

If we instantiate a model with an `id`, Backbone.js will automatically perform a get request to the urlRoot + '/id' (conforming to RESTful conventions)

{% highlight javascript %}

    // Here we have set the `id` of the model
    var user = new Usermodel({id: 1});

    // The fetch below will perform GET /user/1
    // The server should return the id, name and email from the database
    user.fetch({
        success: function (user) {
            alert(user.toJSON());
        }
    })

{% endhighlight %}

### Updating a model

Now that we have a model that exists on the server we can perform an update using a PUT request.
We will use the `save` api call which is intelligent and will send a PUT request instead of a POST request if an `id` is present(conforming to RESTful conventions)

{% highlight javascript %}

    // Here we have set the `id` of the model
    var user = new Usermodel({
        id: 1,
        name: 'Thomas',
        email: 'thomasalwyndavis@gmail.com'
    });

    // Let's change the name and update the server
    // Because there is `id` present, Backbone.js will fire
    // PUT /user/1 with a payload of `{name: 'Davis', email: 'thomasalwyndavis@gmail.com'}`
    user.save({name: 'Davis'}, {
        success: function (model) {
            alert(user.toJSON());
        }
    });


{% endhighlight %}

### Deleting a model

When a model has an `id` we know that it exists on the server, so if we wish to remove it from the server we can call `destroy`.  `destroy` will fire off a DELETE /user/id (conforming to RESTful conventions).

{% highlight javascript %}

    // Here we have set the `id` of the model
    var user = new Usermodel({
        id: 1,
        name: 'Thomas',
        email: 'thomasalwyndavis@gmail.com'
    });

    // Because there is `id` present, Backbone.js will fire
    // DELETE /user/1 
    user.destroy({
        success: function () {
            alert('Destroyed');
        }
    });

{% endhighlight %}

### Tips and Tricks

_Get all the current attributes_

{% highlight javascript %}
      
    var person = new Person({ name: "Thomas", age: 67});
    var attributes = person.toJSON(); // { name: "Thomas", age: 67}
    /* This simply returns a copy of the current attributes. */
    
    var attributes = person.attributes;
    /* The line above gives a direct reference to the attributes and you should be careful when playing with it.   Best practise would suggest that you use .set() to edit attributes of a model to take advantage of backbone listeners. */
{% endhighlight %}

_Validate data before you set or save it_

{% highlight javascript %}

    Person = Backbone.Model.extend({
        // If you return a string from the validate function,
        // Backbone will throw an error
        validate: function( attributes ){
            if( attributes.age < 0 && attributes.name != "Dr Manhatten" ){
                return "You can't be negative years old";
            }
        },
        initialize: function(){
            alert("Welcome to this world");
            this.bind("error", function(model, error){
                // We have received an error, log it, alert it or forget it :)
                alert( error );
            });
        }
    });
    
    var person = new Person;
    person.set({ name: "Mary Poppins", age: -1 }); 
    // Will trigger an alert outputting the error
    
    var person = new Person;
    person.set({ name: "Dr Manhatten", age: -1 });
    // God have mercy on our souls
    
{% endhighlight %}

### Contributors

* [Utkarsh Kukreti](https://github.com/utkarshkukreti)
