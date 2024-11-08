import {
    ApplicationCommandOption,
    ChatInputCommandInteraction,
} from 'discord.js';

export type Command = {
    name: string;
    description: string;
    options?: ApplicationCommandOption[];
    dm_permission?: boolean;
    contexts?: number[];
    integration_types?: number[];
    run: (interaction: ChatInputCommandInteraction) => Promise<unknown>;
};

export type CommandNoRun = Omit<Command, 'run'>;
