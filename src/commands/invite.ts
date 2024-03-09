import { Command } from "../types";

export default {
    name: "invite",
    description: "Get the bot's invite link",
    run: async (interaction) => {
        await interaction.reply({
            content: `https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=18432&scope=bot+applications.commands`,
            ephemeral: true
        });
    },
} satisfies Command;