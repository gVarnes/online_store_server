import { Op } from "sequelize";
import { Basket, BasketDevice, Device, DeviceInfo } from "../models/models";

export const basketController = {
  addDevice: async (request, reply) => {
    //getting device id from request
    const { deviceId } = request.body;
    const user = await request.user;

    //every user has basket(it was created in userController) and i am getting this basket via user.id
    const basket = await Basket.findOne({ where: { userId: user.id } });

    console.log(basket.id);
    const basketDevice = BasketDevice.create({
      basketId: basket.id,
      deviceId,
    });

    return reply.status(200).send({ message: "Product was added" });
  },
  getDevices: async (request, reply) => {
    const user = await request.user;

    //looking for basket that belongs to user
    const basket = await Basket.findOne({ where: { userId: user.id } });
    //looking for basketDevices that belongs to basket
    const basketDevices = await BasketDevice.findAll({
      where: { basketId: basket.id },
    });

    //in the result we have to response to the client all info about device
    //aslo we need to await for all elements in array so i use Promise.all
    const responseToTheClient = await Promise.all(
      basketDevices.map(async (item, index) => {
        //looking for devices via deviceId in basketDevices
        return await Device.findOne({
          where: { id: basketDevices[index].deviceId },
          include: {
            model: DeviceInfo,
            as: "info",
            where: {
              deviceId: basketDevices[index].deviceId,
              //found it in the web
              [Op.or]: [{ deviceId: { [Op.not]: null } }],
            },
            required: false,
          },
        });
      })
    );

    reply.send(responseToTheClient);
  },
  deleteDevice: async (request, reply) => {
    const { id } = request.body;
    const user = await request.user;

    //looking for basket that belong to user
    const basket = await Basket.findOne({ where: { userId: user.id } });

    if (basket.userId !== user.id)
      return reply.status(403).send({ message: "You have not access" });
    //destroying devices in basket that has basket.id and deviceId eques to id from request.body

    await BasketDevice.destroy({
      where: { basketId: basket.id, deviceId: id },
    });

    return reply
      .status(200)
      .send({ message: "Device was deleted from basket" });
  },
};
