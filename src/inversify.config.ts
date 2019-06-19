import "reflect-metadata";
// @ts-ignore
import * as env from "node-env-file";
import { Container } from "inversify";
import Axios from "axios";
import { WebhookCollection } from "./http/controllers/WebhookCollection";
import { Config, ConfigKey } from "./Config";
import { WebhookHandler } from "./messenger/WebhookHandler";
import { ChunkCollectionStore, ChunkStoreFactory, NaLunchApi } from "chunk";
import { ErrorHandler } from "./ErrorHandler";
import { FacebookApi } from "./api/FacebookApi";

export const createContainer = (): Container => {
    env(`${__dirname}/../.env`);

    const container = new Container({
        autoBindInjectable: true,
        defaultScope: "Singleton",
    });

    const config = new Config([
        [ConfigKey.APP_NAME, "facebook-bot"],
        [ConfigKey.FB_ACCESS_TOKEN, process.env.FB_ACCESS_TOKEN],
        [ConfigKey.FB_VERIFY_TOKEN, process.env.FB_VERIFY_TOKEN],
        [ConfigKey.GRAYLOG_HOSTNAME, process.env.GRAYLOG_HOSTNAME],
        [ConfigKey.GRAYLOG_PORT, process.env.GRAYLOG_PORT || "12201"],
        [ConfigKey.SENTRY_DSN, process.env.SENTRY_DSN],
    ]);

    container.bind(Container).toConstantValue(container);
    container.bind(Config).toConstantValue(config);

    container
        .bind(WebhookCollection)
        .toDynamicValue(
            () =>
                new WebhookCollection(
                    container.get(WebhookHandler),
                    config.get(ConfigKey.FB_VERIFY_TOKEN),
                ),
        );

    container.bind(ChunkCollectionStore).toDynamicValue(() => {
        const api = new NaLunchApi(Axios);

        return new ChunkCollectionStore(
            api,
            new ChunkStoreFactory(api, container.get(ErrorHandler)),
        );
    });

    container
        .bind(FacebookApi)
        .toDynamicValue(() => new FacebookApi(Axios, config.get(ConfigKey.FB_ACCESS_TOKEN)));

    return container;
};
