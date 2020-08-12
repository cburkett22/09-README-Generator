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
    }else if (existingRepo == "Nope!") {
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
        const queryURL = `https://api.github.com/users/${userInput.username}/repos?per_page=100`;
        const badgeURL = `https://img.shields.io/github/last-commit/${userInput.username}/${userInput.repoName}`;
        
        axios.get(queryURL).then(function(response){
            response.data.map(function(repo){
                if (repo.name === userInput.repoName){
                    repoTitle.push(`# ${repo.name}`);
                    repoTitle.push("");

                    repoTitle.push(`[![GitHub last commit](${badgeURL})]()`);
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

// addTableOfContents() will be prompted at the end of all other functions
function addTableOfContents() {
    inquirer.prompt([
        {
            type: "checkbox",
            name: "tableOfContents",
            message: "Would you like to include a Table of Contents?(Recommended for larger README files):",
            choices: [
                "Yup!",
                "Nope!"
            ]
        }
    ]).then(function({ tableOfContents }){
        if (tableOfContents == "Yup!") {
            inquirer.prompt([
                {
                    type: "checkbox",
                    name: "contents",
                    message: "Which items would you like to be included in your Table of Contents?",
                    choices: [
                        "Title",
                        "Description",
                        "Installation",
                        "Usage",
                        "License",
                        "Contributing",
                        "Tests",
                    ]
                },
                {
                    type: "input",
                    name: "installation",
                    message: "What are the steps that are required to install your project? Provide a step-by-step walk-through of how to get the development environment running:"
                },
                {
                    type: "input",
                    name: "usage",
                    message: "What are the instructions for use?"
                },
                {
                    type: "input",
                    name: "license",
                    message: "What licenses did you use?"
                },
                {
                    type: "input",
                    name: "contributors",
                    message: "Who else contributed to the development of this application?"
                },
                {
                    type: "input",
                    name: "tests",
                    message: "If you wrote tests for your application, how did you run them?"
                },
                {
                    type: "input",
                    name: "email",
                    message: "What is your professional email? This will be displayed for any questions:"
                },
                {
                    type: "input",
                    name: "username",
                    message: "Enter your GitHub username:"
                }
            ]).then(function(userInput){
                repoTitle.push(`## Table of Contents\n`);
                for (i = 0; i < userInput.contents.length; i++) {
                    repoTitle.push(`* [${userInput.contents[i]}](#${userInput.contents[i]})`);
                }
                repoTitle.push("");
                var repoStr = repoTitle.join("\n");
                fs.writeFile("README.md", repoStr, function(error){
                    if (error) {
                        throw error;
                    }
                });
                if (userInput.installation !== "") {
                    repoTitle.push(`## Installation\n${userInput.installation}`);
                    repoTitle.push("");
                }
                if (userInput.usage !== "") {
                    repoTitle.push(`## Usage\n${userInput.usage}`);
                    repoTitle.push("");
                }
                if (userInput.license !== "") {
                    repoTitle.push(`## License\n${userInput.license}`);
                    repoTitle.push("");
                }
                if (userInput.contributors !== "") {
                    repoTitle.push(`## Contributors\n${userInput.contributors}`);
                    repoTitle.push("");
                }
                if (userInput.tests !== "") {
                    repoTitle.push(`## Tests\n${userInput.tests}`);
                    repoTitle.push("");
                }
                if (userInput.email !== null) {
                    repoTitle.push(`## Questions\n${userInput.email}`);
                    repoTitle.push("");
                }
                if (userInput.username !== null) {
                    const queryURL = `https://api.github.com/users/${userInput.username}`;
                    axios.get(queryURL).then(function(response){
                        const avatarImg = response.data.avatar_url;
                        repoTitle.push(`![Avatar image](${avatarImg}/to/img.png)`);
                        repoTitle.push("");
                    });
                }
                var repoStr = repoTitle.join("\n");
                    fs.writeFile("README.md", repoStr, function(error){
                        if (error) {
                            throw error;
                        }
                    });
                    const queryURL = `https://api.github.com/users/${userInput.username}`;
                    axios.get(queryURL).then(function(response){
                        const avatarImg = response.data.avatar_url;
                        repoTitle.push(`![Avatar image](${avatarImg}/to/img.png)`);
                        repoTitle.push("");
                        var repoStr = repoTitle.join("\n");
                        fs.writeFile("README.md", repoStr, function(error){
                            if (error) {
                                throw error;
                            }
                        });
                    });
            });
        } else if (tableOfContents == "Nope!") {
            inquirer.prompt([
                {
                    type: "input",
                    name: "installation",
                    message: "What are the steps that are required to install your project? Provide a step-by-step walk-through of how to get the development environment running:"
                },
                {
                    type: "input",
                    name: "usage",
                    message: "What are the instructions for use?"
                },
                {
                    type: "input",
                    name: "license",
                    message: "What licenses did you use?"
                },
                {
                    type: "input",
                    name: "contributors",
                    message: "Who else contributed to the development of this application?"
                },
                {
                    type: "input",
                    name: "tests",
                    message: "If you wrote tests for your application, how did you run them?"
                },
                {
                    type: "input",
                    name: "email",
                    message: "What is your professional email? This will be displayed for any questions:"
                },
                {
                    type: "input",
                    name: "username",
                    message: "Enter your GitHub username:"
                }
            ]).then(function(userInput){
                if (userInput.installation !== null) {
                    repoTitle.push(`## Installation\n${userInput.installation}`);
                    repoTitle.push("");
                }
                if (userInput.usage !== null) {
                    repoTitle.push(`## Usage\n${userInput.usage}`);
                    repoTitle.push("");
                }
                if (userInput.license !== null) {
                    repoTitle.push(`## License\n${userInput.license}`);
                    repoTitle.push("");
                }
                if (userInput.contributors !== null) {
                    repoTitle.push(`## Contributors\n${userInput.contributors}`);
                    repoTitle.push("");
                }
                if (userInput.tests !== null) {
                    repoTitle.push(`## Tests\n${userInput.tests}`);
                    repoTitle.push("");
                }
                if (userInput.email !== null) {
                    repoTitle.push(`## Questions\nPlease feel free to email me if you have any questions: ${userInput.email}`);
                    repoTitle.push("");
                }
                if (userInput.username !== null) {
                    const queryUrl = `https://api.github.com/users/${userInput.username}`;
                    axios.get(queryUrl).then(function(response){
                        const avatarImg = response.data.avatar_url;
                        repoTitle.push(`![Avatar image](${avatarImg}/to/img.png)`);
                        repoTitle.push("");
                    });
                }
                var repoStr = repoTitle.join("\n");
                    fs.writeFile("README.md", repoStr, function(error){
                        if (error) {
                            throw error;
                        }
                    });
            });
        }
    });
};