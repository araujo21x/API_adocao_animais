import './helpers/env';
import app from './server';
import startConnection from './database/index';

const PORT = process.env.PORT || 5000;

startConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`API Online na porta: ${PORT}`);
  });
});
