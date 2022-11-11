import { Type } from "../models/models";

export const typeConroller = {
  create: async (request, reply) => {
    const { name } = request.body;
    const type = await Type.create({ name });

    return reply.status(200).send(type);
  },
  getAll: async (request, reply) => {
    const types = await Type.findAll();
    return reply.send(types);
  },
};
