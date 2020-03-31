module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: 'docker',
  database: 'gobarber',
  define: {
    timestamp: true, //Para ter coluna de data para armazenar update e insert quando ocrrer campo automatico
    underscored: true,
    underscoredAll: true,
  },
};
