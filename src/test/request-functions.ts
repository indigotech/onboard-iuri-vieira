import * as request from "supertest";

export const authenticateRequest = async (
  query: string,
  data,
  token: string
) => {
  const response = await request(`http://localhost:${process.env.PORT}/graphql`)
    .post("/")
    .send({ query, variables: data })
    .set("Accept", "application/json")
    .set("Authorization", token ?? "");

  return response;
};

export const queryRequest = async (query: string) => {
  const response = await request(`http://localhost:${process.env.PORT}/graphql`)
    .post("/")
    .send({ query })
    .set("Accept", "application/json")
    .expect(200)
    .set("Authorization", "");

  return response;
};

export const loginRequest = async (query: string, data) => {
  const response = await request(`http://localhost:${process.env.PORT}/graphql`)
    .post("/")
    .send({ query, variables: data })
    .set("Accept", "application/json")
    .set("Authorization", "")
    .expect(200);

  return response;
};
