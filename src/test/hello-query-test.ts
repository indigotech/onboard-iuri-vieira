import { expect } from "chai";
import { queryRequest } from "./request-functions";

export const helloQueryTest = describe("Hello query", function () {
  it("shoud return a Hello word string", async () => {
    const response = await queryRequest("query { hello }");

    expect(response.body.data.hello).to.equal("Hello world!");
  });
});
