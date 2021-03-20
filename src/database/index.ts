import '../helpers/env';
import { createConnection } from 'typeorm';
import path from 'path';

class Connection {
  public async startConnection (): Promise<any> {
    await createConnection({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: true,
      logging: false,
      migrationsRun: true,
      entities: [path.join(__dirname, '/entity/*.entity{.ts,.js}')],
      migrations: [path.join(__dirname, '/migrations/*{.ts,.js}')]
    });
  }
}

export default new Connection().startConnection;
