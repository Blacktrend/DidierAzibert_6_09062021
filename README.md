# Backend API training

In order to test this API :

- you need first to clone the frontend dev server and install the required tools and dependencies : https://github.com/OpenClassrooms-Student-Center/dwj-projet6.git
- then clone this repo and install the dependencies
- add your own MongoDB database credentials and a random salting sentence in .env-dist file and rename it as .env (or use the one provided separately)

To start the frontend = ng serve </br>
To access the Frontend = http://localhost:4200 </br>
To start the backend = node server


API routes to test with Postman (with authentification) :

- POST signup user:     http://localhost:3000/api/auth/signup
- POST login user:      http://localhost:3000/api/auth/login
- GET the sauces list:  http://localhost:3000/api/sauces
- GET one sauce:        http://localhost:3000/api/sauces/:id
- POST new sauce:       http://localhost:3000/api/sauces
- PUT modify sauce:     http://localhost:3000/api/sauces/:id
- DELETE sauce:         http://localhost:3000/api/sauces/:id
- POST like sauce:      http://localhost:3000/api/sauces/:id/like


***<b> if signup or login are blocked after 6 attempts tests, just stop and restart the backend server (signup counts for 2 attempts) </b>
