import app from "./app";
import { env } from "./config/env";

const PORT = env.PORT || 3000;

app.listen({ port: PORT }, function (err, address) {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }

  app.log.info(`Server is now listening on ${address}`);
});
