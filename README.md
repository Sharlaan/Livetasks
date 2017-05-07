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
[Why not a Websockets only website ?](http://stackoverflow.com/questions/4852702/do-html-websockets-maintain-an-open-connection-for-each-client-does-this-scale)

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
```
Sidenote: database livetasks could be dumped with:
```sh
pg_dump -U postgres livetasks > .\src\config\database\schemes\schemeTasks.sql
```
but better to write the scheme myself :)
/!\ Important: make sure nothing is using current livetasks DB (especially your IDE), or else Postgres might hang without warning ...

#### Usage
Run the server:
```sh
yarn start:prod
```


#### Build
