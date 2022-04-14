
/**
 * Basic command builder/handler
 * Builds off of native Discord slash commands and interactions.
 */

module.exports = async (client, PG) => {
    CommandsArray = [];

    (await PG(`${process.cwd()}/Commands/*/*.ts`)).map(async (file) => {
        const command = require(file);

        if (!command.name)
            return console.error(`${file.split("/"[7])} is missing a command name.`);

        if (!command.description)
            return console.error(`${file.split("/"[7])} is missing a command name.`);

        if (command.permission) {
            command.defaultPermission = false;
        }

        client.commands.set(command.name, command);
        CommandsArray.push(command);

    });

    // Permission Validation
    client.on("ready", async () => {
        client.guilds.cache.forEach(g => {
            g.commands.set(CommandsArray).then(async (command) => {
                const Roles = (commandName) => {
                    const cmdPerms = CommandsArray.find((c) => c.name === commandName).permission;
                    if (!cmdPerms) return null;

                    return g.roles.cache.filter((r) => r.permissions.has(cmdPerms) || r.permissions.has("ADMINISTRATOR"));
                }

                const fullPermissions = command.reduce((accumulator, r) => {
                    const roles = Roles(r.name);
                    if (!roles) return accumulator;

                    const permissions = roles.reduce((a, r) => {
                        return [...a, { id: r.id, type: "ROLE", permission: true }]
                    }, []);

                    return [...accumulator, { id: r.id, permissions }];
                }, []);

                await g.commands.permissions.set({ fullPermissions })


            })
        });


    });


};