## LiveTasks

Livetasks is a collaborative realtime TODOs manager.
Enjoy the [Demo](https://git.ideolys.com/ideolys/livetask-raphael-morineau) !


#### Table of Contents
- [Features](#Features)
- [Technologies](#Architecture-and-Technologies)
- [Installation](#Installation)
- [Usage](#Usage)
- [Build](#Build)


#### Features


#### Architecture and Technologies
1st attempt: REST + Websockets in client requests callback
works but high communication load between server and clients (2x per request: once for initial REST endpoint + persistance into DB, then a second from client to notify server to broadcast on success)

2nd attempt: Websockets only
doesnot work, hard to initialize, not future-proof if need REST later
[Why not a Websockets only website ?](http://stackoverflow.com/questions/4852702/do-html-websockets-maintain-an-open-connection-for-each-client-does-this-scale)

3rd attempt: mix of the 2 above
REST requests => server psersist data in DB + calls socket.io to broadcast to other clients =>  other clients listen socket.on('event', message)
Using websockets only for server => client way sounds ideal but couldnot get the current request's ID to map it to a socket ID, so socket.io know who to NOT broadcast.

#### Installation
1. Make sure node7+ and PostgreSQL are installed:
```sh
node -v && psql -V
```
Both commands should yield a finite version number.
(resp. v7.9.0 and v9.6.2 in my case)

2. Install globally yarn and pm2:  
```sh
npm i -g yarn pm2
```
3. Clone the project locally:
```sh
git clone https://rmorineau@git.ideolys.com/ideolys/livetask-raphael-morineau.git livetasks
```
4. Install dependencies
```sh
cd livetasks && yarn
```
5. Create PostgreSQL database 'livetasks':
Create databases livetasks and livetasks_test:
```sh
createdb -U postgres livetasks
createdb -U postgres livetasks_test
```
Note: if database name(s) exists already on your system, you may want to use the command above with a different name.

Next use the dump to create and populate the tables:
```sh
yarn migrate
or
psql -U postgres livetasks < .\src\config\database\schemes\livetasks_dump.sql
```
Sidenote: database livetasks were dumped with:
```sh
pg_dump -U postgres livetasks > .\src\config\database\schemes\livetasks_dump.sql
```


#### Usage
Run the server:
```sh
yarn start:prod
```


#### Build
