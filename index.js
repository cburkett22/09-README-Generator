const inquirer = require("inquirer");
const fs = require("fs");
const axios = require("axios");
const repoTitle = [];

inquirer.prompt([
    {
        type: "checkbox",
        name:"existingRepo",
        message: "Are you building a README for an existing repository?",
        choices: [
            "Yup!",
            "Nope!"
        ]
    }
]).then(function({ existingRepo }) {
    if (existingRepo == "Yup!"){
        promptUsername();
    }else{
        addNewRepo();
    }
});

// prompt the user to input GitHub account info if they have an existing repository
function promptUsername(){
    inquirer.prompt([
        {
            type: "input",
            name: "username",
            message: "Enter your GitHub username:"
        },
        {
            type: "input",
            name: "repoName",
            message: "Enter your repository's name:"
        }
    ]).then(function(answers){
        const queryURL = `https://api.github.com/users/${answers.username}/repos?per_page=100`;
        
        axios.get(queryURL).then(function(response){
            response.data.map(function(repo){
                if (repo.name === answers.repoName){
                    repoTitle.push(`# ${repoName}`);
                    repoTitle.push("");

                    var repoStr = repoTitle.join("\n");

                    fs.writeFile("README.md", repoStr, function(error){
                        if (error){
                            throw error;
                        }
                    });
                    if (repo.description === null){
                        buildReadme();
                    }
                }
            })
        })
    
    });
};

function addNewRepo() {

};

function buildReadme() {

};

