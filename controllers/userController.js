import { User, Basket } from "../models/models";
import { hash, compare } from "bcrypt";
import { sign, verify } from "jsonwebtoken";

const generateJWT = (id, email, role) => {
  return sign({ id, email, role }, process.env.SECRET, {
    expiresIn: "24h",
  });
};

export const userController = {
  registration: async (request, reply) => {
    const { email, password, role } = request.body;

    const hashPassword = await hash(password, 5);
    const user = await User.create({
      email,
      password: hashPassword,
      role,
    });
    const basket = await Basket.create({ userId: user.id });

    return reply.status(201).send(user);
  },
  login: async (request, reply) => {
    const { email, password, role } = request.query;
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (user && compare(user.password, password)) {
      const token = generateJWT(user.id, user.email, user.role);
      return reply.status(200).send({ token });
    }

    return reply.status(403).send({ message: "Access denied" });
  },
  auth: async (request, reply) => {
    const { authorization } = request.headers;

    if (!authorization)
      return reply.status(401).send({ message: "Unauthorized" });

    const user = verify(authorization.split(" ")[1], process.env.SECRET);

    //now we remember user when we get new requests in instance.addHook....()
    if (user) {
      request.user = User.findOne({
        where: {
          id: user.id,
        },
      });

      // generate a new token and return it to the client
      // const token = generateJWT(user.id, user.email, user.role);
      // return reply.status(200).send({ token });
      return;
    }

    return reply.status(401).send({ message: "Unauthorized" });
  },
};
