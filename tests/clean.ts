import { config } from 'dotenv';
import { getRepository } from 'typeorm';

import startConnection from '../src/database/index';
import Address from '../src/database/entity/Address.entity';
import User from '../src/database/entity/User.entity';

config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });
async function run () {
  try {
    await startConnection();
    await getRepository(Address).delete({});
    await getRepository(User).delete({});
  } catch (err) {
    throw new Error(err.message);
  } finally {
    process.exit();
  }
}

run();
