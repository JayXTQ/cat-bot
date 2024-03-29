import "dotenv/config";
import { ActivityType, Client, GatewayIntentBits } from "discord.js";
import path from "node:path";
import fs from "node:fs";
import { Command } from "./types";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { Client as PGClient } from "pg";
import { CronJob } from "cron";
import { daily } from "./dailies";
import express, { Response } from "express";
import { servers } from "../db/schema";
import { eq } from "drizzle-orm";

const app = express();

const client = new Client({
    intents: [GatewayIntentBits.GuildMessages],
});

export let db: NodePgDatabase;

export const commands = new Map<string, Command>();

client.on("ready", async () => {
    const pgClient = new PGClient({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    await pgClient.connect();

    db = drizzle(pgClient);

    for (const file of fs.readdirSync(
        path.join(process.cwd(), "/src/commands"),
    )) {
        const command: Command = (await import("./commands/" + file)).default;
        commands.set(command.name, command);
    }

    console.log(
        `Bot is in servers with id: ${client.guilds.cache.map((guild) => guild.id).join(", ")}, it has now started`,
    );

    client.user.setPresence({
        activities: [
            {
                name: "for /meow",
                type: ActivityType.Watching,
            }
        ]
    })
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

app.get("/", (res: Response) => {
    res.send("Hello World!");
});

app.listen(process.env.PORT || 3000);

client.login(process.env.TOKEN);
