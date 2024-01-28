const { readdirSync, writeFile } = require('fs');
const inquirer = require("inquirer")

const loadEvents = (client, dir = './Events') => {
    readdirSync(dir).forEach(dirs => {
        const events = readdirSync(`${dir}/${dirs}`).filter(files => files.endsWith(".js"));

        for (const event of events) {
        const evt = require(`../${dir}/${dirs}/${event}`);
        const evtName = event.split(".")[0];
        client.on(evtName, evt.bind(null, client));

        console.log(`✅ Successfully loaded the ${evtName} event !`);
        };
    });
};

const loadData = async () => {
    inquirer.prompt([
        {
            type: 'password',
            name: 'TOKEN',
            message: "Please, enter the Discord account token:\n",
            mask: '*'
        },
        {
            type: 'input',
            name: 'SLASHCOMMANDS',
            message: 'Please, enter a bot id and his slash command, you can change it later in the data.json file located in the Data folder: <botID> - <slashCommandName> - <delayInMinutes> / <anotherBotID> - <anotherSlashCommandName> - <anotherDelayInMinutes> \n',
        },
        {
            type: 'input',
            name: 'CHANNELS',
            message: "Please, enter the channels IDs: <Channel ID> <Another channel ID>\n",
        }
    ])
    .then(res => {
        function createSlashCommandsData (data) {
            let largeScheme = '';
            data.forEach(couple => {
                const elements = couple.split(" - ") // ["botid", "command"]
                const objScheme = `{"BOTID": "${elements[0]}", "COMMAND":"${elements[1]}", "DELAY": ${elements[2]}}${elements[1] !== data[data.length - 1].split(" - ")[1] || elements[0] !== data[data.length - 1].split(" - ")[0] ? ',' : ''}` // If it's not the last one, it has a ","
                largeScheme += objScheme // '{"BOTID: "ID", "COMMAND": "slashCommandName", "DELAY" : "someDelayInMinutes"}, ...}'
            });
            return JSON.parse('[' + largeScheme + ']') 
            /*
                [
                    {
                    "BOTID" : "12345678910",
                    "COMMAND" : "bump",
                    "DELAY" : 125
                    },
                    {
                        "BOTID: "145678656",
                        "COMMAND": "bump",
                        "DELAY": 30
                    }
                ]
            */
        }
        const data = {
            TOKEN: res.TOKEN,
            SLASHCOMMANDS: createSlashCommandsData(res.SLASHCOMMANDS.split(" / ")),
            CHANNELS: res.CHANNELS.split(" "),
        }
        console.log(data)
        dataString = `module.exports = ${JSON.stringify(data)}`
        writeFile("./config.js", dataString, ((err, result) => {
            console.log("✅ I've successfully created your data ! You can run node .\\index.js or manually modify these values in the config.js file !");    
        }))
    })
    .catch(err => console.log(err + "❌ An error has occurred ! Please follow the schemes given. If it doesn't work, please open an issue on Github !"))
}

module.exports = {
    loadEvents,
    loadData
}