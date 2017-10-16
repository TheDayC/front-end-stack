# Front End Stack
A small front end tool to assist with day to day task automation.

## Features
- NPM dependency manager
- Gulp task automation
- SCSS compilation
- JS compilation
- Browserify support
- JSHint support
- Bootstrap SASS v3.3.7
- Materialize SASS v0.100.2

## Setup Instructions
- Install NodeJS: https://nodejs.org/en/download/
- Open a terminal
- Install GulpJS CLI by running this command: npm install gulp-cli -g
- Navigate to your project directory in your terminal.
- Install dependencies: npm install

## Gulp Instructions
- "gulp css" compiles scss files from source to build, postfixes file to .min and applies compression once. 
- "gulp jshint" checks source/main.js and any required dependencies for errors based on the .jshintrc config file in root. 
- "gulp js" runs "gulp jshint", applies browserify to main.js, forces ES2015 standards, bundles and pipes to build/js, postfixes file to .min and applies compression once.
- "gulp clean" removes all build files.
- "gulp build" runs "gulp css" then "gulp js".
- "gulp watch" watches files in the source/scss and source/js directories then runs "gulp css" or "gulp js" based on the directory. It will then continue to watch for another change.
