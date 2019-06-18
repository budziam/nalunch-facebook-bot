import "reflect-metadata";
import { createContainer } from "./src/inversify.config";
import { ServerHttp } from "./src/ServerHttp";
import { setupLogging } from "./src/logging";
import { Config } from "./src/Config";

const container = createContainer();
const config = container.get<Config>(Config);

setupLogging(config);

const server = container.get<ServerHttp>(ServerHttp);
server.start();
