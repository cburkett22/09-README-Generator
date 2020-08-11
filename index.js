const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");

inquirer.prompt({
    message: "Enter your GitHub username:",
    name: "username"
})
.then(function({username}) {

});

fs.appendFile("newREADME.md", function(error){
    if (error){
        return console.log(error);
    }

    console.log("Success!");
});