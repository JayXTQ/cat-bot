import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { servers } from '../db/schema';
import {AttachmentBuilder, Client, TextChannel} from 'discord.js';
import axios from 'axios';
import 'dotenv/config';
import {cat_fact, cat_image, getBuffer} from './utils';

export async function daily(db: NodePgDatabase, client: Client) {
    const res = await db.select().from(servers);
    if (!res) return;
    const fact = await cat_fact();
    const image = await cat_image(db);
    const imageBuffer = await getBuffer(image)

    try {
        await client.user?.setAvatar(imageBuffer);
    } catch (error) {
        console.error('Failed to update avatar:', error);
    }
    for (const guildInfo of res) {
        let guild = client.guilds.cache.get(guildInfo.id);
        if (!guild)
            guild = await client.guilds.fetch(guildInfo.id).catch(() => {
                return undefined;
            });
        if (!guild) continue;
        if (guildInfo.fact_channel && guildInfo.send_facts) {
            let fact_channel: TextChannel | undefined =
                guild.channels.cache.get(guildInfo.fact_channel) as
                    | TextChannel
                    | undefined;
            if (!fact_channel)
                fact_channel =
                    ((await guild.channels.fetch(
                        guildInfo.fact_channel
                    )) as TextChannel | null) || undefined;
            if (!fact_channel) break;
            await fact_channel.send(`Today's cat fact:\n${fact}`);
        }
        if (guildInfo.photo_channel && guildInfo.send_photos) {
            let photo_channel: TextChannel | undefined =
                guild.channels.cache.get(guildInfo.photo_channel) as
                    | TextChannel
                    | undefined;
            if (!photo_channel)
                photo_channel =
                    ((await guild.channels.fetch(
                        guildInfo.photo_channel
                    )) as TextChannel | null) || undefined;
            if (!photo_channel) break;
            const attachment = new AttachmentBuilder(imageBuffer, { name: 'daily-cat-img.png' });
            await photo_channel.send({ files: [attachment] });
        }
    }
}
