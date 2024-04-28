import { Command } from '../types';
import { EmbedBuilder } from 'discord.js';

export default {
    name: 'meow',
    description: 'Meow! Here is some information :3',
    run: async (interaction) => {
        const embed = new EmbedBuilder()
            .setTitle('Meow!')
            .setDescription('Meow! Here is some information about me :3')
            .addFields([
                {
                    name: 'How to setup',
                    value: "You can setup the bot by modifying the configuration using /config, you don't have to of course because we have normal commands for you to use, but it's recommended you do",
                },
                {
                    name: 'Commands',
                    value: 'You can use the /help command to find our commands',
                },
                {
                    name: 'Invite',
                    value: 'You can get the current invite to the bot by doing /invite',
                },
                {
                    name: 'Support',
                    value: 'You can join my support server here: https://discord.gg/uZaTYww7hN',
                },
            ])
            .setFooter({ text: 'Made with love, by Jay <3' });
        await interaction.reply({ embeds: [embed] });
    },
} satisfies Command;
