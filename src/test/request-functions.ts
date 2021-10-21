import * as request from "supertest";

export const mutationRequest = async (url, query, data) => {
  const response = await request(url)
    .post("/")
    .send({ query, data })
    .set("Accept", "application/json")
    .expect(200);

  return response;
};

export const queryRequest = async (url, query) => {
  const response = await request(url)
    .post("/")
    .send({ query })
    .set("Accept", "application/json")
    .expect(200);

  return response;
};
