import { FastifyInstance, FastifyRequest } from "fastify";
import { TrainerContainer } from "../domain/trainer/trainer.container";

export const registerTrainerRoutes = (
  server: FastifyInstance,
  container: TrainerContainer
) => {
  server.route({
    method: "GET",
    url: "/trainers",
    handler: async (_request, reply) => {
      reply.header("Access-Control-Allow-Origin", "*");
      reply.header("Access-Control-Allow-Headers", "*");
      reply.header("mode", "no-cors");
      const trainers = await container.getAllTrainersUsecase.execute();
      reply.status(200).send(trainers);
    },
  });

  server.route<{
    Body: { name: string; gender: string };
  }>({
    method: "POST",
    url: "/trainers",
    schema: {
      body: {
        type: "object",
        properties: {
          name: { type: "string" },
          gender: { type: "string" },
        },
        required: ["name", "gender"],
      },
    },
    handler: async (request, reply) => {
      const { name, gender } = request.body;
      reply.header("Access-Control-Allow-Origin", "*");
      reply.header("Access-Control-Allow-Headers", "*");
      reply.header("mode", "no-cors");
      const trainer = await container.createTrainerUsecase.execute({
        name,
        gender,
      });

      reply.status(200).send(trainer);
    },
  });

  server.route<{
    Body: { id: number; name: string; gender: string };
  }>({
    method: "PUT",
    url: "/trainers/:id",
    schema: {
      params: {
        type: "object",
        properties: {
          id: { type: "number" },
        },
        required: ["id"],
      },
      body: {
        type: "object",
        properties: {
          name: { type: "string" },
          gender: { type: "string" },
        },
        required: ["name", "gender"],
      },
    },
    handler: async (request, reply) => {
      const { id } = request.params as { id: number };
      const { name, gender } = request.body;
      reply.header("Access-Control-Allow-Origin", "*");
      reply.header("Access-Control-Allow-Headers", "*");
      reply.header("mode", "no-cors");
      const trainer = await container.updateTrainerUsecase.execute(id, {
        name,
        gender,
      });
      reply.status(200).send(trainer);
    },
  });
  server.route({
    method: "DELETE",
    url: "/trainers/:id",

    handler: async (request: FastifyRequest, reply) => {
      const r = request.params as { id: string };
      const id = parseInt(r.id);

      const trainers = await container.deleteTrainersUsecase.execute(id);
      reply.status(200).send(trainers);
    },
  });
};
