require('dotenv').config();
const { createApp, initDB } = require('./app');

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  await initDB();
  const app = createApp();

  app.listen(PORT, () => {
    console.log(`[frm] API listening on http://localhost:${PORT}`);
  });
}

bootstrap();
