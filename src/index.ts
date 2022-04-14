"use strict";
import Discord from "discord.js";
import { token } from "../config.json";

export var client = new Discord.Client({
    intents: 3067,
    commands: null,
    buttons: null,
});

["Commands", "Events", "Buttons"].forEach((handler) => {
    require(`./${handler}`)(client, PG);
});

client.login(token)