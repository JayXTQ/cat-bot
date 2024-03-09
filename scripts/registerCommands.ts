import fs from "node:fs";
import { REST, Routes } from "discord.js";
import "dotenv/config";
import { CommandNoRun } from "../src/types";

async function registerCommands() {
    try {
        const commands: CommandNoRun[] = [];
        for (const file of fs.readdirSync("./src/commands")) {
            commands.push(
                JSON.parse(
                    JSON.stringify(
                        (
                            await import(
                                `../src/commands/${file.replace(".ts", "")}`
                            )
                        ).default,
                    ),
                ),
            );
        }
        const rest = new REST({ version: "10" }).setToken(
            process.env.TOKEN as string,
        );
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            {
                body: commands,
            },
        );
        console.log("Successfully reloaded application (/) commands.");
    } catch (e) {
        console.error("Error reloading commands:", e);
    }
}

registerCommands();
