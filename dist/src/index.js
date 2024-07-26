"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createApp_util_1 = require("./utils/createApp.util");
const linkRoutes_util_1 = require("./utils/linkRoutes.util");
const createServer_util_1 = require("./utils/createServer.util");
const connector_1 = require("./db/connector");
(0, connector_1.migrateDB)()
    .then(createApp_util_1.createApp)
    .then(app => (0, linkRoutes_util_1.linkRoutes)(app))
    .then(app => (0, createServer_util_1.createServer)(app));
