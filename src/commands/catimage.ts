import { Command } from "../types";
import { cat_image } from "../dailies";
import { AttachmentBuilder, BufferResolvable } from "discord.js";
import { db } from "../index";
import { Stream } from "stream";
import { catImagesCache } from "../../db/schema";

const cooldown = new Set();

export default {
    name: "catimage",
    description: "Get a random cat image, right here, right meow :3",
    run: async (interaction) => {
        if (cooldown.has(interaction.user.id)) {
            return interaction.reply(
                "Wait a bit before using this command again :3",
            );
        }

        cooldown.add(interaction.user.id);
        setTimeout(() => cooldown.delete(interaction.user.id), 10000); // 10 seconds

        let imageUrl: BufferResolvable | Stream;

        try {
            imageUrl = await cat_image(db);
        } catch (error) {
            console.error(
                "Error fetching new image from API, trying cache:",
                error,
            );
            try {
                type CatImagesCache = {
                    url: string;
                };
                let cacheResult: CatImagesCache | CatImagesCache[] = await db
                    .select({ url: catImagesCache.url })
                    .from(catImagesCache);
                cacheResult =
                    cacheResult[Math.floor(Math.random() * cacheResult.length)];

                imageUrl = cacheResult.url;
            } catch (cacheError) {
                console.error("Error fetching image from cache:", cacheError);
                imageUrl = "fallbackImageUrl";
            }
        }

        const attachment = new AttachmentBuilder(imageUrl);
        await interaction.reply({
            files: [attachment],
        });
    },
} satisfies Command;
