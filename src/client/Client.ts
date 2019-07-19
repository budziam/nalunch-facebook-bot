import { Coordinates } from "nalunch-sdk";
import { Psid } from "../messenger/types";
import { ClientProfile } from "./types";

export enum ClientState {
    Start = 1,
    ActionChoice = 2,
    ListBusinesses = 3,
    HumanConversation = 4,
}

export class Client {
    public profile?: ClientProfile;
    public position?: Coordinates;
    public readonly psid: Psid;
    private _state: ClientState = ClientState.Start;

    public constructor(data: Partial<Client> = {}) {
        Object.assign(this, data);
    }

    public get state(): ClientState {
        return this._state;
    }

    public moveToState(newState: ClientState): void {
        this._state = newState;
    }
}
