import pg from 'pg';
const { Pool } = pg;

pg.types.setTypeParser(1082, (val) => {
  return val;
});

const config = {
    user: 'uppulasaikumar',
    host: 'localhost',
    database: 'mydb',
    password: 'uppulasaikumar',
    port: 5432,
  }
  
export let pool = new Pool(config);