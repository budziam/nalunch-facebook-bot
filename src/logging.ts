import * as raven from "raven";
import * as winston from "winston";
import * as winstonGraylog from "winston-graylog2";
import { Config, ConfigKey } from "./Config";

// @ts-ignore
winston.level = "info";

class SentryTransport extends winston.Transport {
    public log(level: any, msg: any, meta: any, callback: any): void {
        if (meta instanceof Error) {
            raven.captureException(meta);
        }

        callback();
    }
}

export const setupLogging = (config: Config): void => {
    if (config.get(ConfigKey.SENTRY_DSN)) {
        raven.config(config.get(ConfigKey.SENTRY_DSN)).install();
        // @ts-ignore
        winston.add(SentryTransport);
    }

    if (config.get(ConfigKey.GRAYLOG_HOSTNAME)) {
        winston.add(winstonGraylog, {
            graylog: {
                servers: [
                    {
                        host: config.get(ConfigKey.GRAYLOG_HOSTNAME),
                        port: config.get(ConfigKey.GRAYLOG_PORT),
                    },
                ],
                facility: config.get(ConfigKey.APP_NAME),
            },
        });
    }
};
