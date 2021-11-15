const { prompt } = require('inquirer');
const asciiartLogo = require('asciiart-logo');
const db = require('./db');
require('console.table');

init();

function init(){
    const logoText = logo({name: 'Employee Manager'}).render();
    console.log(logoText);

    loadPrompts();
}

function loadPrompts(){
    prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices:[
                {
                    name: 'View all employees',
                    value:'VIEW_EMPLOYEES',
                },
                {
                    name: 'View all departments',
                    value:'VIEW_EMPLOYEES',
                },


            ]
        }
    ])
}