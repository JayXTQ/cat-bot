import { pgTable, text, boolean, serial } from "drizzle-orm/pg-core";

export const servers = pgTable("servers", {
    id: text("id").primaryKey(),
    fact_channel: text("fact_channel"),
    photo_channel: text("photo_channel"),
    send_facts: boolean("send_facts").default(false),
    send_photos: boolean("send_photos").default(false),
});

export const catImagesCache = pgTable("cat_images_cache", {
    id: serial("id").primaryKey(),
    url: text("url").notNull().unique(),
});
