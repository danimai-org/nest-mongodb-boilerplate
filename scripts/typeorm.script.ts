import { exec } from 'child_process';
import { program } from 'commander';

program
  .command('run <arg1> [arg2]')
  .action(async (arg1: string, arg2: string) => {
    const path = `${__dirname}/../src/modules/database/migrations/${arg2}`;
    const exec1 = exec(
      `typeorm-ts-node-commonjs -d ormconfig.ts ${arg1} ${
        !!arg2 && arg1 == 'migration:generate' ? path : ''
      }`,
    );
    exec1.stdout.on('data', (data) => {
      console.log(data);
    });
    exec1.stderr.on('data', (data) => {
      console.log(data);
    });
  });

program.parse();
