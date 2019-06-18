import { injectable } from "inversify";
import * as winston from "winston";
import { IncomingEvent } from "./types";
import { ClientManager } from "../client/ClientManager";
import { ControllerFactory } from "./ControllerFactory";
import { Api } from "./Api";

@injectable()
export class WebhookHandler {
    public constructor(
        private readonly api: Api,
        private readonly clientManager: ClientManager,
        private readonly controllerFactory: ControllerFactory,
    ) {
        //
    }

    public async handle(event: IncomingEvent): Promise<void> {
        winston.info("Handle webhook event", {
            psid: event.sender.id,
            text: event.message.text,
            quick_reply: event.message.quick_reply,
        });

        try {
            const client = this.clientManager.get(event.sender.id);

            if (!client.profile) {
                client.profile = await this.api.getProfile(client.psid);
            }

            const controller = this.controllerFactory.create(client, event);
            await controller.handle(client, event);
        } catch (e) {
            winston.error(e);
        }
    }
}
