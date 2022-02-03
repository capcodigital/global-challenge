# Capco Global Challenge
 
![Capco](https://github.com/capcodigital/.github/blob/master/assets/capco_logo.jpg)

## Included

* Redux
* Sagas
* Reselect
* React router
* Jest and Enzyme
* Cypress support
* Scss
* Js lint and es6 lint
* i18n (internationalisation) support
* Precommit hooks
* React docgen and React styleguidist

## To Do

* Sample saga

## Development Setup

 In order to run the app on your local machine follow these steps. 

 ### Database Setup

 - Need to install MongoDB which can be done with Homebrew ($ brew install mongodb-community). 
 - Run ($ mongosh).
 - Create database by running 
 ```
 $ use step-challenge
 ```
 - Create collection by running 
 ```
 $ db.createCollection("challenges")
 ```
Confirm by ($ show collections).

 - Make entry in the collection e.g.:
  ```
 $ db.challenges.insertOne({"name" : "Global Challenge 2021","minTeamSize" : 4,"maxTeamSize" : 4,"startDate" : ISODate("2021-11-08T00:00:00Z"),"endDate" : ISODate("2021-11-21T00:00:00Z"),"status" : "In Progress","challengeName" : "dev"})
```

 Additionally [TablePlus](https://tableplus.com) interface might be used to interact with the database 

### Set up on local machine
 
1.	Check if these files exist in the  ‘./config/keys/’

    Files needed: 
    -	cit.txt
    -   emailPassword.txt
    -	emailUser.txt
    -	fitbit_client.txt
    -   fitbit_secret.txt
    -	strava_client.txt
    -	strava_secret.txt
    -	strava_key.txt

2.	Check your version of Node ($ node -v). If it is not 14.17.5 then follow the guide:

- Confirm that nvm (Node Version Manager) is installed ($ nvm -v). It should output file location. 

- Install correct version of Node with nvm. Can be installed with curl or wget. (https://github.com/nvm-sh/nvm).  

- It is important to run 

```
$ export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```
- Confirm the correct version of node 
```
$ nvm install 14.17.5
```
- You can also verify by running ($ node -v).




### Installation

* Installing yarn ($ yarn install)
* Running the app ($ npm start run)

#### Access on http://localhost


### Troublshooting

If server is not running you might need to follow these additional steps: 

* Troubleshooting with node-sass: run 
```
$ npm install --save-dev rebuild-node-sass node-sass
```

Then follow installations steps again.

* Setting up environment variables for correct UI, run the following: 
for the global challenge: 
```
$ export GOOGLE_MAPS_API_KEY=AIzaSyDj6Xw-eqeq8cHxo4LB6Sn3wqLqiM7E_k8and
```
and

```
$ export CHALLENGE_NAME=global
```
For the UK version please set up the variables: 

$ export  s_MAPS_API_KEY=AIzaSyCYHOtisPconp4HQSmnmdHV3c1i73s3y2s
and 
```
$ export CHALLENGE_NAME=uk
```

Try ($ npm run start) again
 
* Troubleshooting if the port 80 is already used you can kill the service listening on it: 

```
$sudo lsof -i :80
```
Then 
```
$ kill -9 {PID number}
```
with the PID where Node is running.


### Run cypress (ui tests)

```
npm run cypress:open
```

## Contributing
 
If you would like to contribute to any Capco Digital OSS projects please read:
 
* [Code of Conduct](https://github.com/capcodigital/.github/blob/master/CODE_OF_CONDUCT.md)
* [Contributing Guidelines](https://github.com/capcodigital/.github/blob/master/CONTRIBUTING.md)
