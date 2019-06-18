import { injectable } from "inversify";
import { ContentType, EventController, IncomingEvent } from "../types";
import { Client, ClientState } from "../../client/Client";
import { Bus } from "../Bus";

@injectable()
export class MessageController implements EventController {
    public constructor(private readonly bus: Bus) {
        //
    }

    public async handle(client: Client, event: IncomingEvent): Promise<void> {
        const text = event.message.text ? event.message.text.trim() : "";

        if (text === "Siemka") {
            await this.bus.send(client, "Witam!");
        }

        if (client.state === ClientState.ActionChoice) {
            await this.bus.send(
                client,
                "Cześć! Chętnie pomogę Ci znaleźć lunch 🥡 w Twojej okolicy. Wystarczy, że podasz mi swoją lokalizacje 📍",
            );
            await this.bus.send(client, {
                text: "A może mogę jakoś inaczej pomóc?",
                quick_replies: [
                    {
                        content_type: ContentType.Location,
                    },
                    {
                        content_type: ContentType.Text,
                        title: "Rozmowa z człowiekiem",
                    },
                ],
            });
        }

        await this.bus.send(client, "Nie wiem co zrobić :|");
    }
}
