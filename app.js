const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");


const OUTPUT_DIR = path.resolve(__dirname, "output"); //this creates string path to output
const outputPath = path.join(OUTPUT_DIR, "team.html"); //takes string above and add /team.html

const render = require("./lib/htmlRenderer");

const managerInfo = [
    {
        type: 'input',
        message: 'Enter manager name: ',
        name: 'name'
     },
    {
        type: 'input',
        message: 'Enter manager ID: ',
        name: 'id',
        validate: answer => {
          const pass = answer.match(/^[1-9]\d*$/);
          if (pass) {
            return true;
          }
          return "Please enter a valid number";
        }
    },
    {
        type: 'input',
        message: 'Enter manager email: ',
        name: 'email',
        validate: answer => {
          const pass = answer.match(/\S+@\S+\.\S+/);
          if (pass) {
            return true;
          }
          return "Please enter a valid email address.";
        }
    },
    {
        type: 'input',
        message: 'Enter office number: ',
        name: 'officeNumber',
        validate: answer => {
            const pass = answer.match(/^[1-9]\d*$/);
            if (pass) {
              return true;
            }
            return "Please enter a valid number";
          }
    }
];

const engineerInfo = [
    {
        type: 'input',
        message: 'Enter engineer name: ',
        name: 'name'
     },
    {
        type: 'input',
        message: 'Enter engineer ID: ',
        name: 'id',
        validate: answer => {
            const pass = answer.match(/^[1-9]\d*$/);
            if (pass) {
              return true;
            }
            return "Please enter a valid number";
          }
    },
    {
        type: 'input',
        message: 'Enter engineer email: ',
        name: 'email',
        validate: answer => {
            const pass = answer.match(/\S+@\S+\.\S+/);
            if (pass) {
              return true;
            }
            return "Please enter a valid email address.";
          }
    },
    {
        type: 'input',
        message: 'Enter engineer GitHub: ',
        name: 'github'
    }
];

const internInfo = [
    {
        type: 'input',
        message: 'Enter intern name: ',
        name: 'name'
     },
    {
        type: 'input',
        message: 'Enter intern ID: ',
        name: 'id',
        validate: answer => {
            const pass = answer.match(/^[1-9]\d*$/);
            if (pass) {
              return true;
            }
            return "Please enter a valid number";
          }
    },
    {
        type: 'input',
        message: 'Enter intern email: ',
        name: 'email',
        validate: answer => {
            const pass = answer.match(/\S+@\S+\.\S+/);
            if (pass) {
              return true;
            }
            return "Please enter a valid email address.";
          }
    },
    {
        type: 'input',
        message: 'Enter intern school: ',
        name: 'school'
    }
];

let teamMembers = [];

function addEngineer() {
    // prompt manager with engineer questions
    inquirer.prompt(engineerInfo).then(answers => {
        // create new engineer based on manager answers
        const engineer = new Engineer(answers.name, answers.id, answers.email, answers.github);
        // add new engineer to teamMembers array
        teamMembers.push(engineer);
        // createTeam function to add more members or buildTeam html
        createTeam()
    })
}

function addIntern() {
    // prompt manager with intern questions
    inquirer.prompt(internInfo).then(answers => {
        // create new intern based on answers
        const intern = new Intern(answers.name, answers.id, answers.email, answers.school);
        // add intern to teamMembers array
        teamMembers.push(intern);
        // createTeam function to ask manager if there are any more team members
        createTeam()
    })
}

function buildTeam() {
    //if there is no output folder then create an output folder
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }
    //write to file render teamMembers
    fs.writeFileSync(outputPath, render(teamMembers), "utf-8")
}

function createTeam() {
    // prompt manager to create engineer, intern, or finish team
    inquirer.prompt([{
        type: 'list',
        message: 'Do add you want to add to your team?',
        choices: ['Engineer', 'Intern', 'I don\'t have any more team members'],
        name: 'role'
    }]).then(userChoice => {
        switch(userChoice.role) {
            // if manager chooses engineer, then addEngineer function and break
            case "Engineer":
                addEngineer();
                break;
            // if manager chooses intern, then addIntern function and break
            case "Intern":
                addIntern();
                break;
            // otherwise if manager does not have any more team members, buildTeam
            default:
                buildTeam();
        }
    })
}

function createManger() {
    // prompt set of questions specific to manager
    inquirer.prompt(managerInfo).then(answers => {
        // create new manager based on input answers
        const manager = new Manager(answers.name, answers.id, answers.email, answers.officeNumber);
        // add this new manager to the teamMembers array
        teamMembers.push(manager);
        // build team with prompts by calling createTeam function
        createTeam()
    })
}

// Call createManager to start prompts
createManger()
