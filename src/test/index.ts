import startServer from "../index";

const url = `http://localhost:4000/graphql`;
const request = require("supertest")(url);

before(async () => {
  await startServer();
});

describe("First test", function () {
  it("should print something on terminal", function () {
    console.log("The tests are working!");
  });
});

describe("Hello query", function () {
  it("shoud return a Hello word string", (done) => {
    request
      .post("/")
      .send({ query: "query { hello }" })
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        console.log(res.body.data.hello);
        done();
      });
  });
});
