import { Express, Response } from "express";
import { Container } from "inversify";
import { createRequest, createResponse, MockResponse } from "node-mocks-http";
import { ServerHttp } from "../../src/ServerHttp";
import { makeRequest, setup } from "../utils";
import * as http2 from "http2";

const { HTTP_STATUS_OK } = http2.constants;

describe("Webhook collection", () => {
    let container: Container;
    let app: Express;
    let res: MockResponse<Response>;

    beforeEach(() => {
        container = setup();
        app = container.get<ServerHttp>(ServerHttp).app;
        res = createResponse();
    });

    describe("POST", () => {
        it("responds to Siemka", async () => {
            // given
            // TODO Mock API
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
                                        id: "324e234324",
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
            expect(res.status).toBe(HTTP_STATUS_OK);
            expect(res._getData()).toBe("EVENT_RECEIVED");
        });
    });
});
