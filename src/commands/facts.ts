import {Command} from '../types';
import {cat_fact} from '../dailies';

export default {
    name: 'facts',
    description: 'Get a random cat fact, right here, right meow :3',
    run: async (interaction) => {
        await interaction.reply(
            {
                content: await cat_fact(),

            }
        );
    }
} satisfies Command;