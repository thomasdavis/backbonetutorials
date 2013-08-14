# Mongodb Server

In order to persist data to a mongodb database, a server is created to handle all the CRUD operations.

## LOCAL

The quickest way to learn mongodb is by installing it on your local machine using a service like brew or mac ports. For instance, to install mongodb using brew open a terminal window:

$ brew install mongo 

Once you have mongodb installed, you can start it up:

$ mongod 

Then open another a terminal window to test it using the Mongo Shell:

$ mongo 

For the shell, you can name and create your first database and collection. For this demo, I've created my database, "nationalpark"; added two collections: "hikers" and "notes"; and inserted a model into each collection: 

> use nationalpark
> var hiker = { username: "headwinds", health: 100, mana: 100, backpack:[ "lighter", "solar charger", "wine gums" ] }
> db.hikers.insert(hiker)
> var note = { note: "Probably not a good idea to take this route with signs of rain but onwards, upwards!", username: "headwinds" } 
> db.notes.insert(note);
> var hiker.insert 

## HOSTED 

The hosted version relys on the mongodb platform Mongohq (http://www.mongohq.com) which Nodjitsu (http://www.nodejitsu) offers for free to their subscribers but you should be able to use this approach for other platforms. 

The beauty of a hosted platform is that you can share your app with the world, and you don't have to worry about installing or scaling mongodb although you do need to pay for increased traffic and adding more apps. 

