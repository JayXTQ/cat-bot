import { Command } from "../types";
import { EmbedBuilder, PermissionsBitField } from "discord.js";
import { db } from "..";
import { servers } from "../../db/schema";
import { eq } from "drizzle-orm";

const choices = [
    {
        name: "Fact Channel (use channel_value to set)",
        value: "fact_channel",
    },
    {
        name: "Photos Channel (use channel_value to set)",
        value: "photo_channel",
    },
    {
        name: "Send Facts (use boolean_value to set)",
        value: "send_facts",
    },
    {
        name: "Send Photos (use boolean_value to set)",
        value: "send_photos",
    },
];

export default {
    name: "config",
    description: "Get and set the bot's config for your server",
    options: [
        {
            name: "option",
            required: false,
            type: 3,
            description: "The option to set",
            choices,
        },
        {
            name: "channel_value",
            required: false,
            type: 7,
            description: "The channel to set the option to",
        },
        {
            name: "boolean_value",
            required: false,
            type: 5,
            description: "The value to set the option to, true/false or yes/no",
        },
    ],
    dm_permission: false,
    run: async (interaction) => {
        if (interaction.memberPermissions && ((BigInt(interaction.memberPermissions.bitfield) & BigInt(0x5)) !== BigInt(0x5))) return interaction.reply({ content: "You need to have the manage server permission to use this command", ephemeral: true });
        const option = interaction.options.getString("option", false)
        if (!option) {
            let record = (await db
                .select()
                .from(servers)
                .where(eq(servers.id, interaction.guildId as string)))[0];
            if(!record) record = {
                id: interaction.guildId as string,
                fact_channel: null,
                photo_channel: null,
                send_facts: false,
                send_photos: false
            };
            const embed = new EmbedBuilder()
                .setTitle("Server Config")
                .addFields(Object.keys(record).filter((key) => key !== 'id').map((key) => { return {
                    name: choices.find((c) => c.value === key)?.name.split(" (")[0] || key,
                    value: String(record[key] ?? "Not set"),
                }}))
                .setFooter({ text: "Use /config and specify an option to set it" });
            await interaction.reply({ embeds: [embed] });
        }
        switch(option) {
            case "fact_channel": {
                const channel = interaction.options.getChannel("channel_value", true);
                if(!channel) return;
                await db.insert(servers).values({
                    id: interaction.guildId as string,
                    fact_channel: channel.id,
                }).onConflictDoUpdate({ set: { fact_channel: channel.id }, target: servers.id });
                await interaction.reply({
                    content: `Set fact channel to ${channel}`,
                });
                break;
            }
            case "photo_channel": {
                const channel = interaction.options.getChannel("channel_value", true);
                if (!channel) return;
                await db.insert(servers).values({
                    id: interaction.guildId as string,
                    photo_channel: channel.id,
                }).onConflictDoUpdate({ set: { photo_channel: channel.id }, target: servers.id });
                await interaction.reply({
                    content: `Set photo channel to ${channel}`,
                });
                break;
            }
            case "send_facts": {
                const value = interaction.options.getBoolean("boolean_value", true);
                if(!value) return;
                await db.insert(servers).values({
                    id: interaction.guildId as string,
                    send_facts: value,
                }).onConflictDoUpdate({ set: { send_facts: value }, target: servers.id });
                await interaction.reply({
                    content: `Set send facts to ${value}`,
                });
                break;
            }
            case "send_photos": {
                const value = interaction.options.getBoolean("boolean_value", true);
                if(!value) return;
                await db.insert(servers).values({
                    id: interaction.guildId as string,
                    send_photos: value,
                }).onConflictDoUpdate({ set: { send_photos: value }, target: servers.id });
                await interaction.reply({
                    content: `Set send photos to ${value}`,
                });
                break;
            }
        }
    },
} satisfies Command;
