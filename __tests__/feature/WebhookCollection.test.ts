import { Express, Response } from "express";
import { Container } from "inversify";
import { createRequest, createResponse, MockResponse } from "node-mocks-http";
import createMockInstance from "jest-create-mock-instance";
import * as http2 from "http2";
import { ServerHttp } from "../../src/ServerHttp";
import { makeRequest, setup } from "../utils";
import { Api } from "../../src/messenger/Api";

const { HTTP_STATUS_OK } = http2.constants;

describe("Webhook collection", () => {
    let container: Container;
    let app: Express;
    let res: MockResponse<Response>;
    let api: jest.Mocked<Api>;

    beforeEach(() => {
        container = setup();
        res = createResponse();
        api = createMockInstance(Api);
        container.rebind(Api).toConstantValue(api);
        app = container.get<ServerHttp>(ServerHttp).app;
    });

    describe("POST", () => {
        it("responds to Siemka", async () => {
            // given
            const psid = "324e234324";

            const req = createRequest({
                method: "POST",
                url: "/webhook",
                body: {
                    object: "page",
                    entry: [
                        {
                            messaging: [
                                {
                                    message: {
                                        text: "Siemka",
                                    },
                                    sender: {
                                        id: psid,
                                    },
                                },
                            ],
                        },
                    ],
                },
            });

            // when
            await makeRequest(app, req, res);

            // then
            expect(res.statusCode).toBe(HTTP_STATUS_OK);
            expect(res._getData()).toBe("EVENT_RECEIVED");
            expect(api.sendMessage).toBeCalledWith(psid, {
                text: "Dzień dobry!",
            });
        });
    });
});
