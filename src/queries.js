const Pool = require("pg").Pool;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

function getSchoolarship() {
  return new Promise((resolve, reject) =>
    pool.query(
      "SELECT type, value FROM schoolarship WHERE now() + interval '3 hours' >= start_date and now() <= start_date + interval '3 hours' + interval '1 year' - interval '1 day'",
      [],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results.rows);
      }
    )
  );
}

module.exports = {
  getSchoolarship,
};
