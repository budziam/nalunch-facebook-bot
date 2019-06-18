import { Psid } from "../bus/types";
import { boundMethod } from "autobind-decorator";

export enum ClientState {
    Start = 1,
}

export interface ClientProfile {
    avatar: string;
    firstName: string;
    lastName: string;
}

export class Client {
    public get profile(): ClientProfile | undefined {
        return this._profile;
    }

    public get psid(): Psid {
        return this._psid;
    }

    public get state(): ClientState {
        return this._state;
    }
    private _profile?: ClientProfile;
    private readonly _psid: Psid;
    private _state: ClientState = ClientState.Start;

    public constructor(psid: Psid) {
        this._psid = psid;
    }

    public moveToState(newState: ClientState): void {
        this._state = newState;
    }

    @boundMethod
    public setProfile(profile: ClientProfile): void {
        this._profile = profile;
    }
}
