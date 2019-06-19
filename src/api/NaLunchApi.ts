import { AxiosInstance } from "axios";
import { injectable } from "inversify";

@injectable()
export class NaLunchApi {
    public constructor(private readonly axios: AxiosInstance) {
        //
    }
}
