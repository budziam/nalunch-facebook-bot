import { Coordinates } from "chunk";
import { Psid } from "../messenger/types";
import { ClientProfile } from "./types";

export enum ClientState {
    ActionChoice = 1,
    ListBusinesses = 2,
}

export class Client {
    public profile?: ClientProfile;
    public position?: Coordinates;
    public readonly psid: Psid;
    private _state: ClientState = ClientState.ActionChoice;

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
