import {Command} from '../types';
import {cat_fact} from '../dailies';

export default {
    name: 'httpcat',
    description: 'Get a httpcat image by status code, or random!',
    options: [
        {
            type: 4,
            name: 'code',
            description: 'The status code to get the image for',
            required: false
        }
    ],
    run: async (interaction) => {
        const statusCodes = [
            100, 101, 102, 103, 200, 201, 202, 203, 204, 205, 206, 207, 208, 214, 226,
            300, 301, 302, 303, 304, 305, 306, 307, 308,
            400, 401, 402, 403, 404, 405, 406, 407, 408, 409,
            410, 411, 412, 413, 414, 415, 416, 417, 418, 420,
            422, 423, 424, 425, 426, 428, 429, 431, 444,
            450, 451, 497, 498, 499, 500, 501, 502, 503, 504, 505, 506,
            507, 508, 509, 510, 511, 521, 522, 523, 525, 530, 599
        ];
        const code = interaction.options.getInteger('code');
        if (code && statusCodes.includes(code)) {
            await interaction.reply({
                content: `https://http.cat/${code}`
            });
        } else {
            await interaction.reply({
                content: `${code && !statusCodes.includes(code) ? "Because your code doesn't exist, here's a random one :3\n" : ""}https://http.cat/${statusCodes[Math.floor(Math.random() * statusCodes.length)]}`
            });
        }
    }
} satisfies Command;
