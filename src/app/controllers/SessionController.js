import jwt from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../../config/auth';
import * as Yup from 'yup';


class SessionController{
  async store(req,res){
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Dados inválidos.'});
    }

    const {email, password} = req.body;

    const user = await User.findOne({where: {email}});

    if(!user){
      res.status(401).json({error: 'Usuário não encontrado.'});
    }

    if(!(await user.checkPassword(password))){
      res.status(401).json({error: 'Senha não confere.'});
    }

    const {id, name} = user;

    return res.json({
      user: {id,name,email},
      token: jwt.sign({id}, authConfig.secret,{
        expiresIn: authConfig.expireIn,
      }), //colocando o id do usuário no payload do token e colocando como segundo parâmetro texto conhecido, terceiro data de expiração 7 dias
    });

  }
}

export default new SessionController();
