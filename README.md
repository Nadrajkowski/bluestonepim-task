# BluestonePIM recruitment task

## setup

### client
```sh
cd client
#install dependecies
npm install
#run development server
npm start
```

### api

to run the development server of the api a MongoDB must be running on localhost:27017
```sh
cd api
#install dependecies
npm install
#run mongodb in a docker conatiner
./mongo-as-docker.sh
#run development server
npm run dev
```