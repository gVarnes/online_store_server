import sequelize from "./db";
import Fastify from "fastify";
import * as dotenv from "dotenv";
import path from "path";

import { userController } from "./controllers/userController";
import { typeConroller } from "./controllers/typeController";
import { brandConroller } from "./controllers/brandController";
import { deviceController } from "./controllers/deviceController";
import { ratingController } from "./controllers/ratingController";
import { basketController } from "./controllers/basketController";

import { onFile } from "./controllers/deviceController";

dotenv.config();

const REMOVE_HOST = process.env.NODE_ENV ? "0.0.0.0" : "127.0.0.1";
const port = process.env.PORT || 3001;

const fastify = Fastify({
  logger: true,
});

fastify.register(import("@fastify/multipart"), {
  attachFieldsToBody: true,
  onFile,
});

fastify.register(import("@fastify/cors"));

//updates comming soon
fastify.register(import("@fastify/swagger"), {
  swagger: {
    info: {
      title: "Test swagger",
      description: "Testing the Fastify swagger API",
      version: "0.1.0",
    },
    externalDocs: {
      url: "https://swagger.io",
      description: "Find more info here",
    },
    host: "localhost",
    schemes: ["http"],
  },
});

fastify.register(import("@fastify/swagger-ui"), {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
  uiHooks: {
    onRequest: function (request, reply, next) {
      next();
    },
    preHandler: function (request, reply, next) {
      next();
    },
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => {
    return swaggerObject;
  },
  transformSpecificationClone: true,
});

//plugin that gives to client files from public folder via filename
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/public/", // optional: default '/'
});

fastify.post("/user/registration", userController.registration);
fastify.post("/user/login", userController.login);
fastify.get("/device", deviceController.getAll);
fastify.get("/device/:id", deviceController.getOne);
fastify.get("/type", typeConroller.getAll);
fastify.get("/brand", brandConroller.getAll);

fastify.register((instance, {}, done) => {
  instance.addHook("onRequest", userController.auth);
  instance.post("/type", typeConroller.create);
  instance.post("/brand", brandConroller.create);
  instance.post("/device", deviceController.create);
  instance.post("/rating", ratingController.addRating);
  instance.post("/basket", basketController.addDevice);
  instance.get("/basket", basketController.getDevices);
  instance.delete("/basket", basketController.deleteDevice);
  done();
});

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    await fastify.listen({ port, host: REMOVE_HOST });
  } catch (error) {
    console.log(error);
  }
};

start();
