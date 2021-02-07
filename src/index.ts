import './helpers/env';
import app from './server';
import startConnection from './database/index';

startConnection().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`API Online na porta: ${process.env.PORT}`);
  });
});
