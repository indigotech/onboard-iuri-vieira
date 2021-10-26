import { expect } from "chai";
import { queryRequest } from "./request-functions";

describe("Hello query", function () {
  it("shoud return a Hello world string", async () => {
    const response = await queryRequest("query { hello }");

    expect(response.body.data.hello).to.equal("Hello world!");
  });
});
