import * as request from "supertest";

export const mutationRequest = async (query, data, token) => {
  const response = await request(`http://localhost:${process.env.PORT}/graphql`)
    .post("/")
    .send({ query, variables: data })
    .set("Accept", "application/json")
    .set("Authorization", token ?? "");

  return response;
};

export const queryRequest = async (query) => {
  const response = await request(`http://localhost:${process.env.PORT}/graphql`)
    .post("/")
    .send({ query })
    .set("Accept", "application/json")
    .expect(200)
    .set("Authorization", "");

  return response;
};
