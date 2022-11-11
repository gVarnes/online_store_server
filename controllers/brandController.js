import { Brand } from "../models/models";

export const brandConroller = {
  create: async (request, reply) => {
    const { name } = request.body;
    const brand = await Brand.create({ name });

    return reply.status(200).send(brand);
  },
  getAll: async (request, reply) => {
    const brands = await Brand.findAll();
    return reply.send(brands);
  },
};
