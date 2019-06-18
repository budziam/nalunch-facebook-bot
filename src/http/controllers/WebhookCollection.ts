import { boundClass } from "autobind-decorator";
import { Request, Response } from "express";
import { injectable } from "inversify";
import { EndpointNotFoundError } from "../errors";

@injectable()
@boundClass
export class WebhookCollection {
    constructor(
        private readonly webhookHandler: WebhookHandler,
        private readonly token: string,
    ) {
        //
    }

    public async get(req: Request, res: Response): Promise<any> {
        // Your verify token. Should be a random string.
        const VERIFY_TOKEN = this.token;

        // Parse the query params
        const mode = req.query["hub.mode"];
        const token = req.query["hub.verify_token"];
        const challenge = req.query["hub.challenge"];

        // Checks if a token and mode is in the query string of the request
        if (!mode || !token) {
            return res.sendStatus(422);
        }

        // Checks the mode and token sent is correct
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
            // Responds with the challenge token from the request
            console.info("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }

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
        res.status(200).send("EVENT_RECEIVED");
    }
}
