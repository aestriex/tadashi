module.exports = async (client, PG) => {
    const buttonsFolder = await PG(`${process.cwd()}/src/Types/Buttons/*/*.ts`);

    buttonsFolder.map(async (file) => {
        const buttonFile = require(file);
        if (!buttonFile.id) return;

        client.buttons.set(buttonFile.id, buttonFile);
    })


};