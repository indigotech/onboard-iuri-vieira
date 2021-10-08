"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var _a = require('apollo-server'), ApolloServer = _a.ApolloServer, gql = _a.gql;
var typeDefs = gql(__makeTemplateObject(["\n  type Query {\n    hello: String\n  }\n"], ["\n  type Query {\n    hello: String\n  }\n"]));
var resolvers = {
    Query: {
        hello: function () {
            return 'Hello world!';
        },
    },
};
var server = new ApolloServer({ typeDefs: typeDefs, resolvers: resolvers });
server.listen(4000).then(function () {
    console.log("Running server at http://localhost:4000/");
});
