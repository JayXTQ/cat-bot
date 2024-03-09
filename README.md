# cat-bot

The public repository for the "Cat" bot on Discord, made by [Jay](https://jayxtq.xyz).

## Features

Daily cat images and facts, as well as a few other commands to give you information on your favourite feline friends :3

## Dependencies

- discord.js
- axios
- drizzle
- cron
- pg (postgres)
- typescript

## Setup

1. Clone the repository
2. Run `npm install`
3. Rename `.env.example` to `.env` and fill in the required fields, you will reqiure a postgres database which works with the `pg` package if you wish to contribute towards the database side of things, to get more info, check the [database](#database) section below.
4. Run `npm run dev` to start the bot in development mode, or `npm run dev:watch` to start the bot in development mode with file watching
5. Enjoy!

## Database

For databases, I am using heroku, the database stuff on there is free and works with the `pg` package. To get a database from Heroku you will need to setup an app on Heroku, then install the [Heroku Postgres](https://elements.heroku.com/addons/heroku-postgresql) add-on, then you can get the database URL from the settings tab of the add-on and use that as the `DATABASE_URL` in the `.env` file.

Once you have the database URL in the `.env` file, you can run `npm run db:generate` to generate some SQL commands you will need to run inside your database to setup the tables and columns required for the bot to work, these commands will generate inside of a file located in the `drizzle` folder just created, you should see a file looking somewhat like `x_y_z.sql` (x, y and z are all to be replaced with whatever, x should be 4 numbers and y and z should be words, doesn't matter), Heroku sadly does not have an SQL executor if you are using them, so what I recommend is installing [Beekeeper Studio](https://github.com/beekeeper-studio/beekeeper-studio) to run the SQL commands, Beekeeper is also quite useful at just looking at the database anyway.

You should be able to run the bot now.