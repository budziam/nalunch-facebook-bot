import { boundClass, boundMethod } from "autobind-decorator";
import { Request, Response } from "express";
import { injectable } from "inversify";
import * as winston from "winston";
import * as http2 from "http2";
const { HTTP_STATUS_OK, HTTP_STATUS_FORBIDDEN, HTTP_STATUS_UNPROCESSABLE_ENTITY } = http2.constants;
import { EndpointNotFoundError } from "../errors";
import { WebhookHandler } from "../../bus/WebhookHandler";

@injectable()
@boundClass
export class WebhookCollection {
    public constructor(
        private readonly webhookHandler: WebhookHandler,
        private readonly token: string,
    ) {
        //
    }

    @boundMethod
    public async get(req: Request, res: Response): Promise<any> {
        // Your verify token. Should be a random string.
        const VERIFY_TOKEN = this.token;

        // Parse the query params
        const mode = req.query["hub.mode"];
        const token = req.query["hub.verify_token"];
        const challenge = req.query["hub.challenge"];

        // Checks if a token and mode is in the query string of the request
        if (!mode || !token) {
            return res.sendStatus(HTTP_STATUS_UNPROCESSABLE_ENTITY);
        }

        // Checks the mode and token sent is correct
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
            // Responds with the challenge token from the request
            winston.info("WEBHOOK_VERIFIED");
            res.status(HTTP_STATUS_OK).send(challenge);
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(HTTP_STATUS_FORBIDDEN);
        }
    }

    @boundMethod
    public async post(req: Request, res: Response): Promise<any> {
        const body = req.body;

        // Checks this is an event from a page subscription
        if (body.object !== "page") {
            throw new EndpointNotFoundError();
        }

        // Iterates over each entry - there may be multiple if batched
        for (const entry of body.entry) {
            // Gets the message. entry.messaging is an array, but
            // will only ever contain one message, so we get index 0
            await this.webhookHandler.handle(entry.messaging[0]);
        }

        // Returns a '200 OK' response to all requests
        res.status(HTTP_STATUS_OK).send("EVENT_RECEIVED");
    }
}
