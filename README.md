# sc-sample-inventory

Scroll to the bottom for installation instructions.

A sample inventory tracking realtime single page app built with SocketCluster (http://socketcluster.io/), Google's Polymer (v1.0) Framework and RethinkDB.
It demonstrates a way of building realtime apps.

All code for the server-side worker logic is linked from worker.js - It's mostly generic so feel free to reuse/modify for your own app
or you can use this app as a base to build yours if starting from scratch.

Aside from SocketCluster, Polymer and RethinkDB, this sample app uses the following modules:
- sc-collection (https://github.com/SocketCluster/sc-collection - ```bower install sc-collection --save```)
- sc-field (https://github.com/SocketCluster/sc-field - ```bower install sc-field --save```)
- sc-crud-rethink (https://github.com/SocketCluster/sc-crud-rethink - ```npm install sc-crud-rethink --save```)

This sample app aims to demonstrate all the cutting edge features that one might want when
building a realtime single page app including:

- Authentication (via JWT tokens)
- Access control using backend middleware
- Reactive data binding
- Realtime REST-like interface
- Pagination with realtime updates

This is still work in progress.
Keep in mind that this app is optimized for cutting-edgeness, not for backwards
compatibility with older browsers :p

To make the most of this demo, you should open the web app in two different tabs/windows/browsers and
make updates to the data in realtime.


## Installation

To run this sample:

- Make sure you have Git installed (https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- Make sure you have Node.js installed (http://nodejs.org/)
- Make sure you have RethinkDB installed (https://www.rethinkdb.com/)
- ```git clone https://github.com/SocketCluster/sc-sample-inventory.git```
- Navigate to the sc-sample-inventory/ directory
- Run ```npm install``` (no arguments)
- Make sure you have bower installed, if not: ```npm install -g bower```
- Run ```bower install``` (no arguments)
- Run ```sudo rethinkdb```
- Run ```node server```
- In your browser, go to ```http://localhost:8000/```
