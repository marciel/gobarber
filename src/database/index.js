import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';
import mongoose from 'mongoose';

const models = [User,File,Appointment];

class Database{
  constructor(){
    this.init();
    this.mongo();
  }

  init(){
    this.connection = new Sequelize(databaseConfig);
    models
    .map(model => model.init(this.connection))
    .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo(){
    //Base de dados vai ser criada automaticamente com o nome gobarber pelo mongo
    //Se tiver senha a base de dados, informa também, neste caso foi criada a instância/imagem sem senha
    this.mongoConnection = mongoose.connect(
      process.env.MONGO_URL,
      {
        useNewUrlParser: true,
        useFindAndModify: true,
      },
    );
  }

}

export default new Database();
