import "dotenv/config";
import { ActivityType, Client, GatewayIntentBits } from "discord.js";
import path from "node:path";
import fs from "node:fs";
import { Command } from "./types";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { Client as psClient } from "@planetscale/database"
import { CronJob } from "cron";
import { daily } from "./dailies";
import express, { Response, Request } from "express";
import { servers } from "../db/schema";
import { eq } from "drizzle-orm";
import https from "https";

const app = express();

const client = new Client({
    intents: [GatewayIntentBits.GuildMessages],
});

const ps = new psClient({
    url: process.env.DATABASE_URL
});

export let db = drizzle(ps);

export const commands = new Map<string, Command>();

client.on("ready", async () => {
    for (const file of fs.readdirSync(
        path.join(process.cwd(), "/src/commands"),
    )) {
        const command: Command = (await import("./commands/" + file)).default;
        commands.set(command.name, command);
    }

    console.log(
        `Bot is in servers with id: ${client.guilds.cache
            .map((guild) => guild.id)
            .join(", ")}, it has now started`,
    );

    client.user.setPresence({
        activities: [
            {
                name: "for /meow",
                type: ActivityType.Watching,
            },
        ],
    });
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = commands.get(interaction.commandName);
    if (!command) return;
    await command.run(interaction);
});

client.on("guildDelete", async (guild) => {
    db.delete(servers).where(eq(servers.id, guild.id));
});

new CronJob(
    "0 0 * * *",
    async function () {
        await daily(db, client);
    },
    null,
    true,
    "utc",
); // i hope this runs honestly :sob:

app.get("/", async (_, res: Response) => {
    res.send(
        `
        <link rel="icon" href="${(await client.users.fetch(process.env.CLIENT_ID)).displayAvatarURL()}" />
<p>Hello World!</p>

<p>There is nothing to look at here, please check out my <a href="https://github.com/JayXTQ/cat-bot">source code</a>!</p>

<p>All images used are owned by their respective owners, I do not own any of them. They are set via the random daily cat image.</p>`,
    );
});

process.env.DEV === '0' ? https.createServer({
    key: fs.readFileSync('./certs/key.pem'),
    cert: fs.readFileSync('./certs/cert.pem'),
}, app).listen(process.env.PORT || 3000) : app.listen(process.env.PORT || 3000);

client.login(process.env.TOKEN);
