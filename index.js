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
    ]).then(function(userInput){
        const queryURL = `https://api.github.com/users/${userInput.username}/repos?per_page=100`;
        
        axios.get(queryURL).then(function(response){
            response.data.map(function(repo){
                if (repo.name === userInput.repoName){
                    repoTitle.push(`# ${repo.name}`);
                    repoTitle.push("");

                    var repoStr = repoTitle.join("\n");
                    fs.writeFile("README.md", repoStr, function(error){
                        if (error){
                            throw error;
                        }
                    });

                    if (repo.userStory === null){
                        buildReadme();
                    }else {
                        repoTitle.push("## Description" + "\n" + repo.userStory);
                        repoTitle.push("");

                        var repoStr = repoTitle.join("\n");
                        fs.writeFile("README.md", repoStr, function(error){
                            if (error) {
                                throw error;
                            }
                        });
                        addTableOfContents();
                    }
                }
            });
        });
    });
};

// add a new repo if the user does not already have an existing repo
function addNewRepo() {
    inquirer.prompt([
        {
            type: "input",
            name: "newRepoName",
            message: "What is the name of your new repository?"
        },
        {
            type: "input",
            name: "role",
            message: "What is your role or job position?"
        },
        {
            type: "input",
            name: "capability",
            message: "What would you like you program to do? 'I would like a program that will:'"
        },
        {
            type: "input",
            name: "benefit",
            message: "A 'so' statement; 'I want my program to do THIS so that:'"
        },
        {
            type: "input",
            name: "resources",
            message: "What tools or processes did you use to achieve this? 'In order to do THIS, I will:'"
        }
    ]).then(function(userInput){
        repoTitle.push(`# ${userInput.newRepoName}`);
        repoTitle.push("");

        const userStory = `As a ${userInput.role}, I have created an application that will ${userInput.capability}. I have created this application so that ${userInput.benefit}. In order to achieve this, I will ${userInput.resources}.`;
        repoTitle.push(`## Description\n${userStory}`);
        repoTitle.push("");

        var repoStr = repoTitle.join("\n");
        fs.writeFile("README.md", repoStr, function(error){
            if (error) {
                throw error;
            }
        });
        addTableOfContents();
    });
};

// build the users README file if the userStory = null
function buildReadme() {
    inquirer.prompt([
        {
            type: "input",
            name: "role",
            message: "What is your role or job position?"
        },
        {
            type: "input",
            name: "capability",
            message: "What would you like you program to do? 'I would like a program that will:'"
        },
        {
            type: "input",
            name: "benefit",
            message: "A 'so' statement; 'I want my program to do THIS so that:'"
        },
        {
            type: "input",
            name: "resources",
            message: "What tools or processes did you use to achieve this? 'In order to do THIS, I will:'"
        }
    ]).then(function(userInput) {
        const userStory = `As a ${userInput.role}, I have created an application that will ${userInput.capability}. I have created this application so that ${userInput.benefit}. In order to achieve this, I will ${userInput.resources}.`;
        repoTitle.push(`## Description\n${userStory}`);
        repoTitle.push("");

        var repoStr = repoTitle.join("\n");
        fs.writeFile("README.md", repoStr, function(error){
            if (error) {
                throw error;
            }
        });
        addTableOfContents();
    });
};

function addTableOfContents() {

};