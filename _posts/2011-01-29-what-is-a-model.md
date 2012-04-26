---
layout: post
title: What is a model?
type: beginner
posturl: http://backbonetutorials.com/what-is-a-model
---

h2. What is a model?

p. Across the internet the definition of "MVC":http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller is so diluted that it's hard to tell what exactly your model should be doing.   The authors of backbone.js have quite a clear definition of what they believe the model represents in backbone.js.

bq. Models are the heart of any JavaScript application, containing the interactive data as well as a large part of the logic surrounding it: conversions, validations, computed properties, and access control.

p. So for the purpose of the tutorial let's create a model.

{% highlight javascript %}
    Person = Backbone.Model.extend({
        initialize: function(){
            alert("Welcome to this world");
        }
    });
    
    var person = new Person;
{% endhighlight %}

p. So _initialize()_ is triggered whenever you create a new instance of a model( models, collections and views work the same way ).   You don't have to include it in your model declaration but you will find yourself using it more often than not.

h4. Setting attributes

p. Now we want to pass some parameters when we create an instance of our model.

{% highlight javascript %}
    Person = Backbone.Model.extend({
        initialize: function(){
            alert("Welcome to this world");
        }
    });
    
    var person = new Person({ name: "Thomas", age: 67});
    delete person;
    // or we can set afterwards, these operations are equivelent
    var person = new Person();
    person.set({ name: "Thomas", age: 67});
    
{% endhighlight %}

p. So passing a javascript object to our constructor is the same as calling _model.set()_.   Now that these models have attributes set we need to be able to retrieve them.  

h4. Getting attributes

p. Using the _model.get()_ method we can access model properties at anytime.

{% highlight javascript %}
    Person = Backbone.Model.extend({
        initialize: function(){
            alert("Welcome to this world");
        }
    });
    
    var person = new Person({ name: "Thomas", age: 67, children: ['Ryan']});
    
    var age = person.get("age"); // 67
    var name = person.get("name"); // "Thomas"
    var children = person.get("children"); // ['Ryan']
    
{% endhighlight %}

h4. Setting model defaults

p. Sometimes you will want your model to contain default values.   This can easily be accomplished by setting a property name 'defaults' in your model declaration.

{% highlight javascript %}
    Person = Backbone.Model.extend({
        defaults: {
            name: 'Fetus',
            age: 0,
            children: []
        },
        initialize: function(){
            alert("Welcome to this world");
        }
    });
    
    var person = new Person({ name: "Thomas", age: 67, children: ['Ryan']});
    
    var age = person.get("age"); // 67
    var name = person.get("name"); // "Thomas"
    var children = person.get("children"); // ['Ryan']
    
{% endhighlight %}

h4. Manipulating model attributes

p.  Models can contain as many custom methods as you like to manipulate attributes.   By default all methods are public.

{% highlight javascript %}
    Person = Backbone.Model.extend({
        defaults: {
            name: 'Fetus',
            age: 0,
            children: []
        },
        initialize: function(){
            alert("Welcome to this world");
        },
        adopt: function( newChildsName ){
            var children_array = this.get("children");
            children_array.push( newChildsName );
            this.set({ children: children_array });
        }
    });
    
    var person = new Person({ name: "Thomas", age: 67, children: ['Ryan']});
    person.adopt('John Resig');
    var children = person.get("children"); // ['Ryan', 'John Resig']
    
{% endhighlight %}

p. So we can implement methods to get/set and perform other calculations using attributes from our model at any time.   


h4. Listening for changes to the model

p. Now onto one of the more useful parts of using a library such as backbone.   All attributes of a model can have listeners bound to them to detect changes to their values.   In our initialize function we are going to bind a function call everytime we change the value of our attribute.   In this case if the name of our "person" changes we will alert their new name.

{% highlight javascript %}
    Person = Backbone.Model.extend({
        defaults: {
            name: 'Fetus',
            age: 0,
            children: []
        },
        initialize: function(){
            alert("Welcome to this world");
            this.bind("change:name", function(){
                var name = this.get("name"); // 'Stewie Griffin'
                alert("Changed my name to " + name );
            });
        },
        replaceNameAttr: function( name ){
            this.set({ name: name });
        }
    });
    
    var person = new Person({ name: "Thomas", age: 67, children: ['Ryan']});
    person.replaceNameAttr('Stewie Griffin'); // This triggers a change and will alert()
{% endhighlight %}

p. So we can bind the a change listener to individual attributes or if we like simply '_this.bind("change", function(){});_' to listen for changes to all attributes of the model.

h4. Fetching, Saving and Destroying

p. Models actually have to be a part of a collection for requests to the server to work by default.   This tutorial is more of a focus on individual models.  Check back soon for a tutorial on collection implementation.

h4. Tips and Tricks

p. *Get all the current attributes*

{% highlight javascript %}
      
    var person = new Person({ name: "Thomas", age: 67, children: ['Ryan']});
    var attributes = person.toJSON(); // { name: "Thomas", age: 67, children: ['Ryan']}
    /* This simply returns a copy of the current attributes. */
    delete attributes;
    var attributes = person.attributes;
    /* The line above gives a direct reference to the attributes and you should be careful when playing with it.   Best practise would suggest that you use .set() to edit attributes of a model to take advantage of backbone listeners. */
{% endhighlight %}

p. *Validate data before you set or save it*

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
    delete person;
    
    var person = new Person;
    person.set({ name: "Dr Manhatten", age: -1 });
    // God have mercy on our souls
    
{% endhighlight %}

h3. Relevant Links
* "backbone.js official website":http://documentcloud.github.com/backbone/

h3. Author

* "Thomas Davis":https://github.com/thomasdavis

h3. Contributors

* "Utkarsh Kukreti":https://github.com/utkarshkukreti
