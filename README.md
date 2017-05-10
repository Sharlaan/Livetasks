## LiveTasks

Livetasks is a collaborative realtime TODOs manager, forked from [this project](https://github.com/DonoSybrix/TodoList).  
Enjoy the [Demo]() ! (not deployed yet)  
![](https://github.com/Sharlaan/Livetasks/blob/master/Capture.png)

#### Table of Contents
- [Architecture and Technologies](#Architecture-and-Technologies)
- [Installation](#Installation)
- [Usage](#Usage)
- [Build](#Build)
- [Known issues](#Known-issues)


#### Architecture and Technologies
MVVM architecture forked from [this project](https://github.com/DonoSybrix/TodoList).

This project is organised with microservices in mind, into 3 sub-projects:
- one for the client-side static server
- one for the server-side dynamic server
- one for the postgresql datatable*

\* for now, datatable structure is integrated inside the api project.  
TODO: extract db-related commands, settings and queries into its own repository.

Interesting arguments against Websockets: [Why not a Websockets only website ?](http://stackoverflow.com/questions/4852702/do-html-websockets-maintain-an-open-connection-for-each-client-does-this-scale)

#### Installation
1. Make sure node7+ and PostgreSQL are installed:
```sh
node -v && psql -V
```
Both commands should yield a finite version number.  
(resp. v7.10.0 and v9.6.2 in my case)  
Note: for your convenience, make sure the symbolic link 'psql' is in your PATH.  
  

2. Install globally yarn and pm2:  
```sh
npm i -g yarn pm2
```


3. Clone the project locally:
```sh
git clone https://rmorineau@git.ideolys.com/ideolys/livetask-raphael-morineau.git livetasks
cd livetasks
```


4. Install API server  
Open a new CLI in /server folder  
Firstly, you may want to configure names, ports and password @ `server/src/config/settings.js`  
then run:
```sh
yarn
```
4-bis. If the command above fails, verify dependencies have been correctly installed  
then, in 'server' CLI, create PostgreSQL database 'livetasks':
```sh
yarn migrate
```
you can test if your data have been correctly injected into 'tasks' table:
```sh
yarn testdb
```

/!\ Important: make sure nothing is using current livetasks DB (especially your IDE),  
or else Postgres might hang without warning ...  
to remove database /!\ WARNING: ALL DATA IN livetasks DB WILL BE DELETED:
```sh
yarn removedb
```


5. Install client server  
Open a new CLI in /client folder, then run:
```sh
yarn
```


6. Enjoy !
```sh
yarn start
or
yarn openBrowser
```

You should end up with 3 CLIs:
- a webapp running @ port 3000 ('client' CLI)
- a websockets-based api server running @ port 3210 ('server' CLI)
- a database livetasks running @ port 5432 (main CLI)
- your default browser running @ http://localhost:3000


#### Usage
Basic CRUD operations :
- Add a new task: 2 options  
either click on menu in upper-right corner of the task list,  
or click on the big + button.
- Remove a task: click on the X button (right side of each task).  
Note: the task won't be permanently deleted, but 'suspended', so an administrator can retrieve/restore it.
- Update a task status by clicking on it. This will toggle the task's status and increment/decrement the counter.  
The task's content can also be edited by clicking on the edit button (pen icon next to X icon).  
To validate an edited value, you can use 'Enter' or click away from the input; 'Escape' will cancel.

Addition/Deletion of a task will be notified with a counter in upper-right corner.
Hovering this counter will tell current % of completion.

###### Server-side testing:
```sh
yarn test
```
... then you can read the coverage report with:
```sh
yarn coverage
```


#### Build
If you want to play in development mode, first stop the server and client processes with:
```sh
pm2 ls
pm2 stop all
pm2 delete all
pm2 kill
```
Next, run `yarn start` on each server and client CLIs:  
this will run both servers with nodemon in automatic watch mode.
// TODO: use Webpack


#### Known issues
Compatibility issues:
- hovering the taskgroup menu buttons does not change the background in Firefox (does not support rgba+hover?)
- read-only input in Firefox still display a cursor inside
