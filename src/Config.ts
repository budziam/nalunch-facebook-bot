import { injectable } from "inversify";

export enum ConfigKey {
    APP_NAME = "APP_NAME",
    FB_ACCESS_TOKEN = "FB_ACCESS_TOKEN",
    FB_VERIFY_TOKEN = "FB_VERIFY_TOKEN",
    GRAYLOG_HOSTNAME = "GRAYLOG_HOSTNAME",
    GRAYLOG_PORT = "GRAYLOG_PORT",
    SENTRY_DSN = "SENTRY_DSN",
}

@injectable()
export class Config extends Map<ConfigKey, string> {
    //
}
