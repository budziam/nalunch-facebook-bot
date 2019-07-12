import { Client, ClientState } from "../client/Client";
import { Bus } from "./Bus";
import { injectable } from "inversify";
import { ACTION_CHOICE_REPLIES } from "./constants";

@injectable()
export class FallbackService {
    public constructor(private readonly bus: Bus) {
        //
    }

    public async unknownSituation(client: Client): Promise<void> {
        client.moveToState(ClientState.ActionChoice);
        await this.bus.send(client, {
            text:
                "Trochę się pogubiłem 😞 Pamiętaj 💡 zawsze możesz wpisać 'anuluj', aby wrócić do początku. Jak mogę Ci pomóc?",
            quick_replies: ACTION_CHOICE_REPLIES,
        });
    }
}
