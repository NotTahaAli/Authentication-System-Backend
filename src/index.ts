import { createApp } from "./utils/createApp.util";
import { linkRoutes } from "./utils/linkRoutes.util";
import { createServer } from "./utils/createServer.util";
import { migrateDB } from "./db/connector";

migrateDB()
    .then(createApp)
    .then(app => linkRoutes(app))
    .then(app => createServer(app));