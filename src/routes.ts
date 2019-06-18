import { Router } from "express";
import { Container } from "inversify";
import { controllerHandler } from "./http/utils";
import { WebhookCollection } from "./http/controllers/WebhookCollection";

export const getRoutes = (container: Container): Router => {
    const router = Router();

    const webhookCollection = container.get<WebhookCollection>(WebhookCollection);

    router.get("/webhook", controllerHandler(webhookCollection.get));
    router.post("/webhook", controllerHandler(webhookCollection.post));

    return router;
};
