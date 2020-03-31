import Sequelize, {Model} from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model{
  static init(sequelize){
    super.init(
    {
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      password: Sequelize.VIRTUAL, //campo apenas para interface, não existe na base de dados
      password_hash: Sequelize.STRING,
      provider: Sequelize.BOOLEAN,
    },
    {
      sequelize,
    });

    //Executado antes de realizar manutenção no banco de dados
    this.addHook('beforeSave',async (user)=>{
      if(user.password){//se informado password gera novo hash
        //Realizando hash, parametro 8 com a força da criptografia
        user.password_hash = await bcrypt.hash(user.password,8);
      }
    });
    return this;
  }

  static associate(models){
    this.belongsTo(models.File, {foreignKey: 'avatar_id', as: 'avatar'});
  }

  //Verificação de senha são iguais, se batem, retorna true ou false, faz a comparação de hash
  checkPassword(password){
    return bcrypt.compare(password,this.password_hash);
  }

}

export default User;
