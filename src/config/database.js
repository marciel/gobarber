require ('dotenv/config');

module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  define: {
    timestamp: true, //Para ter coluna de data para armazenar update e insert quando ocrrer campo automatico
    underscored: true,
    underscoredAll: true,
  },
};
