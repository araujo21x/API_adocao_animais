import '../helpers/env';
import { createConnection } from 'typeorm';
import path from 'path';

class Connection {
  public async startConnection (): Promise<any> {
    await createConnection({
      type: 'postgres',
      url: process.env.HEROKU_POSTGRESQL_AQUA_URL,
      synchronize: true,
      logging: false,
      migrationsRun: true,
      entities: [path.join(__dirname, '/entity/*.entity{.ts,.js}')],
      migrations: [path.join(__dirname, '/migrations/*{.ts,.js}')],
      ssl: false,
      extra: {
        ssl: {
          rejectUnauthorized: false
        }
      }
    });
  }
}

export default new Connection().startConnection;
