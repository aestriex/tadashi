
/**
 * Event base handler
 * Handles the execution of events and parsing of event arguments.
 */

module.exports = async (client, PG) => {

    (await PG(`${process.cwd()}/Events/*/*.ts`)).map(async (file) => {
        const event = require(file);

        if (!event.name) {
            await console.error(`${file.split("/"[6])}'s name is unavailable or unreachable.`);
            return;
        };

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        };

    });


};