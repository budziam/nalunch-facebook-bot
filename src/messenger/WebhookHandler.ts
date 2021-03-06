import { injectable } from "inversify";
import * as winston from "winston";
import { IncomingEvent } from "./types";
import { ClientProvider } from "../client/ClientProvider";
import { ControllerFactory } from "./ControllerFactory";
import { FacebookApi } from "../api/FacebookApi";
import * as util from "util";
import { ErrorHandler } from "../ErrorHandler";

@injectable()
export class WebhookHandler {
    public constructor(
        private readonly api: FacebookApi,
        private readonly clientProvider: ClientProvider,
        private readonly controllerFactory: ControllerFactory,
        private readonly errorHandler: ErrorHandler,
    ) {
        //
    }

    public async handle(event: IncomingEvent): Promise<void> {
        winston.info("Handle webhook event", {
            psid: event.sender.id,
            text: event.message.text,
            quick_reply: event.message.quick_reply,
        });

        // tslint:disable-next-line:no-null-keyword
        console.log(util.inspect(event, false, null, true));

        try {
            const client = this.clientProvider.get(event.sender.id);

            if (!client.profile) {
                client.profile = await this.api.getProfile(client.psid);
            }

            const controller = this.controllerFactory.create(client, event);
            await controller.handle(client, event);
        } catch (e) {
            this.errorHandler.handle(e);
        }
    }
}
