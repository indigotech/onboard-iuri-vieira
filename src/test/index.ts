import startServer from "../connect";
import * as dotenv from "dotenv";

before(async () => {
  dotenv.config({ path: `${__dirname}/../../test.env` });
  await startServer();
});

require("./hello-query-test");
require("./createUser-test");
require("./getUser-test");
