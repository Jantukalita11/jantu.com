import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifyInstance {
    consumeCredits(teamId: string, amount: number): Promise<void>;
    checkCredits(teamId: string, required: number): Promise<boolean>;
  }
}

export default fp(async (app) => {
  app.decorate("consumeCredits", async (_teamId: string, _amount: number) => {
    // TODO: write ledger entry via Prisma
    app.log.info({ _teamId, _amount }, "Consumed credits (stub)");
  });
  app.decorate("checkCredits", async (_teamId: string, _required: number) => {
    // TODO: compute available credits from plan + ledger
    return true; // allow in scaffold
  });
});
