import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { catImagesCache, servers } from "../db/schema";
import { Client, TextChannel } from "discord.js";
import axios from "axios";
import "dotenv/config";

export async function daily(db: NodePgDatabase, client: Client) {
    const res = await db.select().from(servers);
    if (!res) return;
    const fact = await cat_fact();
    const image = await cat_image(db);
    const imageBuffer = await axios
        .get(image, {
            responseType: "arraybuffer",
        })
        .then((response) => Buffer.from(response.data));

    try {
        await client.user?.setAvatar(imageBuffer);
    } catch (error) {
        console.error("Failed to update avatar:", error);
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
                        guildInfo.fact_channel,
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
                        guildInfo.photo_channel,
                    )) as TextChannel | null) || undefined;
            if (!photo_channel) break;
            await photo_channel.send(`[Your daily cat image! : 3](${image})`);
        }
    }
}

export async function cat_image(db: NodePgDatabase): Promise<string> {
    try {
        const response = await axios.get(
            "https://api.thecatapi.com/v1/images/search",
            {
                headers: { "x-api-key": process.env.CAT_API_KEY },
            },
        );
        const newImageUrl: string = response.data[0].url;

        await db
            .insert(catImagesCache)
            .values({ url: newImageUrl })
            .onConflictDoNothing();

        return newImageUrl;
    } catch (error) {
        if (error.response && error.response.status === 429) {
            type CacheResult = { url: string; id: number };
            let cacheResult: CacheResult[] | CacheResult = await db
                .select()
                .from(catImagesCache);
            cacheResult =
                cacheResult[Math.floor(Math.random() * cacheResult.length)];

            return cacheResult.url;
        } else {
            throw error;
        }
    }
}

export async function cat_fact(): Promise<string> {
    return (await axios.get("https://catfact.ninja/fact")).data.fact;
}
