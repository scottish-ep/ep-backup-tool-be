This project is an overview of how to use pg_dump and cron to automate backing up a Postgres database and sending it to a remote location.

It is composed of two files - backup-database.js and index.js. All relevant methods are contained in the former file, which only exposes a single method.

## In order to get the project to work, create a .env file and enter the following file .env-example


Next step run node index.js

| | | | | |
| | | | | +-- Year (range: 1900-3000)
| | | | +---- Day of the Week (range: 1-7, starting from Monday)
| | | +------ Month of the Year (range: 1-12)
| | +-------- Day of the Month (range: 1-31)
| +---------- Hour (range: 0-23)
+------------ Minute (range: 0-59)
