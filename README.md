Project-V is an online pwa based video editor which does video manipulation from client side. Due to its abilities as a PWA, it can be saved like an app and used offline like a  offline app.

# Note to Visitiors

Check out this [Video](https://www.youtube.com/watch?v=LZ1zYCbrSsU&t=8s "Video") to see a quick demo of our application 

Project-V is currently deployed in render, check it out using the link 
[Project-V Production](https://project-v-production.onrender.com/ "Project-V Production")

If you would like to take a look into the main core of this project, you should check out [feature_script.js](https://github.com/RinoJonathan/Project-V-mirror/blob/main/public/javascript/original/feature_script.js "feature_script.js") file

To check out the caching logic, check out [sw.js](https://github.com/RinoJonathan/Project-V-mirror/blob/main/public/sw.js "sw.js") from public files

Feeling Confused about the project's directory sturcture, click [here](https://github.com/RinoJonathan/Project-V-mirror/blob/main/documentation/directory_structure.md)

And ... if you would like to share your feedbacks and thoughts, send us a mail to 
 projectv103@gmail.com
we are eager to listen

# Setting up

## Install Dependencies

Project V has two main dependencies
1. MongoDB
2. Nodejs
3. Git

Dependency on redis was removed to enable mobility during possible future migrations

Though there are no dependencies on operating system, We highly recommend you to use Linux

### 1.Mongodb
Install mongodb community edition.  refer to this link https://www.mongodb.com/docs/manual/administration/install-community/
The installation steps may vary based on your OS so refer to the linked page and install mongodb. 

### 2.Nodejs 
ProjectV is an nodejs based webapplication so nodejs is an hardcoded dependency.
refer to this page to install nodejs https://nodejs.org/en/download



### 3.Git
like most others, we will be using git as our version control tool. 
refer to this page for downloading it https://git-scm.com/downloads

Note: If you are using linux, refer to the internet on how to install these for your distro. Though the techniques vary based on distribution of your linux, It becomes as easy as just executing a single command
eg: in arch distributions, runing
		
		sudo pacman -S node mongodb git
installs these dependencies swiftly


## Setting up repo

### 1. Clone the repo
use

	git clone https://github.com/JustinFrost47/Project-V.git

to get an local copy of  our project

### 2. Install node modules

go to the cloned repository  and open a terminal / cmd there and run 

	npm install

### 3. Create env

create env files .env.development, .env.production with required fields

	cp documentation/sample-env/sample-env.txt .env.development
	cp documentation/sample-env/sample-env.txt .env.production

## Running project in development mode

Earlier, we had to go through a whole list of procedure to switch from dev to production mode and vice versa. Well after getting to know about some good practices, I simplified the process

just spin up a terminal and run 

	npm run dev

stuff like caching, service workier, optimized cdn usage will all be avoided .

## Running project in production mode

execute 

	npm run start 

from a terminal to run in local production mode

## Before comitting your code

the following steps have to be done if you want to commit  your code (sharing your work to main repo)


### 1. sw.js version update

if you do any changes to  client side component of our project, dont forget to update the version number from  /public/sw.js file

const CACHE_VERSION = 'someNumber';

you must  increment this number . 
The reason we do this is because, updating the cache_version triggers an update on our clients. Their caches get updated and they can  see the change 

### 2. minify scripts

if you want to make a change to one of the following files, 
	1.public/javascript/original/feature_script.js
	2.public/javascript/original/script.js

shutdown  the server and run  (dont forget to revert envmode to production before doing this)

	npm run minify
	
if you face any errors, fix it and try again. if you dont face any errors, then these files will become minified outside

### 3. Tests
as of now unit tests have been written for feature scripts only. Thats because its kinda a complex part of our system. So, run npm run test to run tests

read documentation folder of the project to get a good understanding of this project

