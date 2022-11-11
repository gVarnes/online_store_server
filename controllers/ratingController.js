import { Device, Rating } from "../models/models";

export const ratingController = {
  addRating: async (request, reply) => {
    const { rate, deviceId } = request.body;
    const user = await request.user;

    //  adding rate to the table "rating"
    await Rating.create({
      rate,
      deviceId,
      userId: user.id,
    });

    //looking for all ratings whit deviceId
    const rating = await Rating.findAndCountAll({ where: { deviceId } });

    let allRating = 0;
    let avgRating;

    //calc avarage rating of all items in table "rating"
    //first of all i am plusing all rate in once
    //then i am deviding it on their count
    rating.rows.forEach((item) => (allRating += item.rate));
    avgRating = Math.round(allRating / rating.count);

    await Device.update({ rating: avgRating }, { where: { id: deviceId } });

    reply.send({ message: "Rating was added" });
  },
  //showRating comming soon
};
