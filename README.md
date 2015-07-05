# sc-sample-inventory
Sample inventory tracking realtime single page app built with SocketCluster (http://socketcluster.io/) and Google's Polymer framework (v1.0).

All code for the server-side worker logic is linked from worker.js - It's mostly generic so feel free to reuse/modify for your own app
or you can use this app as a base to build yours if starting from scratch. I will try to make these modules available publicly as soon as
I've cleaned up the code base.

This sample app aims to demonstrate all the features that one might need when building a realtime single page app including:

- Authentication
- Access control
- Realtime REST-like interface
- Pagination with realtime updates

This is still work in progress.

To run this sample:

- ```git clone``` this repo
- Navigate to the sc-sample-inventory directory
- Run ```npm install``` (no arguments)
- Make sure you have bower installed, if not: ```npm install -g bower```
- Navigate to sc-sample-inventory/public/ directory
- Run ```bower install``` (no arguments)
- Go to main sc-sample-inventory directory
- Run ```node server```

### Backstory

SocketCluster (and this proof-of-concept project) is the culmination of more than 3 years of work towards my goal of building a 
framework to power the next generation of web apps. SocketCluster did not come out of nowhere - It is the successor to the following failed projects:

1. jCombo (PHP/JavaScript full stack framework - https://github.com/jondubois/jcombo/graphs/contributors)
2. Nombo (Node.js/JavaScript full stack framework - https://github.com/jondubois/nombo/graphs/contributors)

When I started working towards this goal in January 2012, I wanted to make a full-stack framework which would handle everything and allow
developers to build entire web apps from scratch.
Before the concept of 'realtime' had even entered my mind, the initial goal was simply to build a framework which would bring frontend and backend 
logic closer together - This is what my first project jCombo was about; it allowed developers to call server-side PHP methods directly from client-side JavaScript code.
Unfortunately, nobody really cared much about jCombo - I guess the PHP/JavaScript combination was awkward and it was my first project of this kind 
so I couldn't really expect it to be a success - In any case, it was a great opportunity to develop my idea/vision of what the next generation of 
web applications would be like.

Some time after publishing jCombo on GitHub (and having completed a fair bit of work), I learned about Node.js.
At that point, I started to feel like I had wasted a lot of time trying to make client-side JavaScript play nicely with server-side PHP.
As much as I tried, I couldn't avoid the fact that Node.js was a tool which my project desperately needed.
With the ability to run JavaScript on both the frontend and backend (using Node.js), I would finally be able to seamlessly pass data between the client and
server. Socket.io was the module which really sold Node.js to me - The idea of being able to push data directly to clients was a feature that I had thought
about but couldn't dream of implementing in PHP :p

After playing around with Node.js some more, I decided to rewrite the entire backend part of jCombo in JavaScript (on top of Node.js).
I renamed the project to nCombo (then later to Nombo). It was only after I had finished porting all my PHP code to Node.js that 
I found out about Meteor, then Derby, then SocketStream and all the other full-stack frameworks which were also trying to solve the same 
problem as I was. This back when the term 'Single Page App' started gaining traction.

At that point, I started promoting Nombo on Reddit (/r/node) to see what the community thought of it.
Based on feedback from Reddit users, I learned the following things:

- Nombo was a monolithic framework.
- Developers generally don't like monolithic frameworks - They prefer to use small specialized tools/modules.
- Nombo wasn't popular enough and neither was I so no developer would want to risk building their app on top of it.

Around that time I also met up with an ex Google Wave engineer to discuss my project and he gave me a really important piece of advice; he
suggested that I should break Nombo up into smaller components (particularly the realtime part). And so I did just that.

This is how SocketCluster started - I essentially just pulled it out of Nombo, cleaned up a lot and then published it as a stand-alone module.
After getting SC into a somewhat stable state, I ran some benchmark performance tests and posted the results
on http://reddit.com/r/node/ and then went to sleep at about 2am. The next day I woke up to find that the SocketCluster 
repo had accumulated almost 600 GitHub stars overnight. It appears that someone saw my post on Reddit and then re-posted it to Hacker news where it had
made it to the front page (See https://news.ycombinator.com/item?id=7712766).

It seems that breaking up my monolithic project into lighter stand-alone modules turned out to be a good idea after all.

While I was doing all of this, some really good front-end frameworks (AngularJS, EmberJS, CanJS, Polymer...) started materializing and 
they had amazing data-binding features which allowed you to declaratively add live data placeholders to your frontend views/templates.
So I spent a lot of time thinking about how I could extend SocketCluster to leverage those features - It occurred to me that having
client-side Pub/Sub channels would be really powerful and scalable way to achieve that - So I made pub/sub a central aspect of SC.

The goal of client-side pub/sub is to allow frontend views to declaratively subscribe to data channels - Then, using data binding,
the view can passively consume/display the data from those channels in realtime as soon as it gets updated on the server.

If you look at the backend logic in worker.js, you should notice that the code there is mostly generic (it doesn't have much domain-specific logic).
I could probably pull some of that logic out into new stand-alone modules (and I intend to) because you could reuse them for pretty much any app.
All Polymer front-end code is inside the public/ directory.

I hope you find this useful.

- Jon Dubois
