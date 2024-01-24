Project-V is an online pwa based video editor which does video manipulation from client side. Due to its abilities as a PWA, it can be saved like an app and used offline like a  offline app.

#Setting up

##Install Dependencies

Project V has two main dependencies
1. MongoDB
2. Nodejs
3. Git

Though there are no dependencies on operating system, We highly recommend you to use Linux

###1.Mongodb
Install mongodb community edition.  refer to this link https://www.mongodb.com/docs/manual/administration/install-community/
The installation steps may vary based on your OS so refer to the linked page and install mongodb. 

###2.Nodejs 
ProjectV is an nodejs based webapplication so nodejs is an hardcoded dependency.
refer to this page to install nodejs https://nodejs.org/en/download



###3.Git
like most others, we will be using git as our version control tool. 
refer to this page for downloading it https://git-scm.com/downloads

Note: If you are using linux, refer to the internet on how to install these for your distro. Though the techniques vary based on distribution of your linux, It becomes as easy as just executing a single command
eg: in arch distributions, runing
		
		sudo pacman -S node mongodb git
installs these dependencies swiftly


##Setting up repo

###1. Clone the repo
use

	git clone https://github.com/JustinFrost47/Project-V.git

to get an local copy of  our project

###2. Install node modules

go to the cloned repository  and open a terminal / cmd there and run 

	npm install


##Running project in development mode

The instructions upto now might be trivial and could be easily be done . However the instructions on the following section requires some attentivenes from the developer. Due to the nature of our project, certain lines have to be changed from the project temporarily in order to work in development mode

###1. Dev branch
switch to developmental branch, main branch is protected , so switch to developmental branch and commit your changes there

	git checkout developmental

###2 .env file
in file /.env  edit the first line

	ENV_MODE=production

to

	ENV_MODE=developmental

this will change the resources used to favour the developer

###3. script files

in the files
	1.public/javascript/original/feature_script.js
	2.public/javascript/original/script.js

change one of initial lines from 

	const envMode = "production"
to

	const envMode = "developmental"

these will use locally held bulky files and also switch off pwa mode. Switching off pwa ensures that your changes gets updated and a cached file is not shown instead


###4. run dev server

now run 

	npm run dev

to run developmental server. 

you can visit https://localhost:3000/ to visit the home page of our locally run project.
from this point, you can develop the project 


## Before comitting your code

the following steps have to be done if you want to commit  your code (sharing your work to main repo)

###1. undo changes from env and js

In the previous section, you would have changed .env file and script and feature_script.js
now undo those changes 

 from 
	
	ENV_MODE=developmental

and

	const envMode = "developmental"
to

	const envMode = "production"
	
and 
	
	ENV_MODE=production


###2. sw.js version update

if you do any changes to  client side component of our project, dont forget to update the version number from  /public/sw.js file

const CACHE_VERSION = 'someNumber';

you must  increment this number . 
The reason we do this is because, updating the cache_version triggers an update on our clients. Their caches get updated and they can  see the change 

###3. minify scripts

if you want to make a change to one of the following files, 
	1.public/javascript/original/feature_script.js
	2.public/javascript/original/script.js

shutdown  the server and run  (dont forget to revert envmode to production before doing this)

	npm run minify
	
if you face any errors, fix it and try again. if you dont face any errors, then these files will become minified outside


