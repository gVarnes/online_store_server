import { Device, DeviceInfo } from "../models/models";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import util from "util";
import { pipeline } from "stream";

const pump = util.promisify(pipeline);

//its called in index.js when we register(@fastify/multipart,{attch...,onFile}), so file move into folder and
//we can work with other body
export const onFile = async (data) => {
  //this function needs to separate request on body(which will be used in deviceController) and request.file
  // without this it doesnt work
  //generate random name and now request remember this new random name( i mean in request.body its the same)
  data.filename = uuidv4() + ".jpg";
  return await pump(
    data.file,
    fs.createWriteStream(path.resolve(__dirname, "..", "public", data.filename))
  );
};

export const deviceController = {
  create: async (request, reply) => {
    const { name, price, brandId, typeId, img } = request.body;
    let { info } = request.body;

    const device = await Device.create({
      name: name.value,
      price: price.value,
      brandId: brandId.value,
      typeId: typeId.value,
      img: img.filename,
    });

    //if deviceInfo is not false, we create a deviceinfo
    if (info) {
      //we get it as a string so it is needed to be parsed
      info = JSON.parse(info);

      //mabye it should work without async/await
      info.forEach(async (item) => {
        await DeviceInfo.create({
          title: item.title,
          description: item.description,
          deviceId: device.id,
        });
      });
    }

    return reply.send(device);
  },
  getAll: async (request, reply) => {
    const { brandId, typeId } = request.query;
    let { limit, page } = request.query;
    limit = limit || 9;
    page = page || 1;
    //calc pagination
    let offset = page * limit - limit;
    let devices;

    //findAndCountAll() returns to as array with devices in field raw and returns count of pages
    //so i use it instead of findAll()
    if (!brandId && !typeId) {
      devices = await Device.findAndCountAll({ limit, offset });
    }
    if (brandId && !typeId) {
      devices = await Device.findAndCountAll({
        where: { brandId },
        limit,
        offset,
      });
    }
    if (!brandId && typeId) {
      devices = await Device.findAndCountAll({
        where: { typeId },
        limit,
        offset,
      });
    }
    if (brandId && typeId) {
      devices = await Device.findAndCountAll({
        where: { typeId, brandId },
        limit,
        offset,
      });
    }

    return reply.status(200).send(devices);
  },
  getOne: async (request, reply) => {
    const { id } = request.params;

    const device = await Device.findOne({
      where: { id },
      //i need to get info about device
      //include is used for getting multiple associated models at once
      include: [{ model: DeviceInfo, as: "info" }],
    });

    reply.status(200).send(device);
  },
};
