import { Command } from '../types';
import { cat_fact } from '../utils';

export default {
    name: 'facts',
    description: 'Get a random cat fact, right here, right meow :3',
    contexts: [0, 1, 2],
    integration_types: [0, 1],
    run: async (interaction) => {
        await interaction.reply({
            content: await cat_fact(),
        });
    },
} satisfies Command;
