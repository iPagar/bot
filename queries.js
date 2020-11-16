const Pool = require("pg").Pool;
const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_DATABASE,
	password: process.env.DB_PASSWORD,
	port: 5432,
});

function getStudent(id) {
	return new Promise((resolve, reject) =>
		pool.query(
			"SELECT student, surname, initials, stgroup, id, notify FROM students WHERE id = ($1)",
			[id],
			(error, results) => {
				if (error) {
					return reject(error);
				}
				return resolve(results.rows[0]);
			}
		)
	);
}

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

function getSemesters(id) {
	return new Promise((resolve, reject) =>
		pool.query(
			"SELECT ARRAY(SELECT DISTINCT semester FROM marks WHERE id = ($1))",
			[id],
			(error, results) => {
				if (error) {
					return reject(error);
				}
				return resolve(results.rows[0].array);
			}
		)
	);
}

module.exports = {
	getStudent,
	getSchoolarship,
	getSemesters,
};
