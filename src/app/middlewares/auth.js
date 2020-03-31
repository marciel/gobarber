import jwt from 'jsonwebtoken';
import {promisify} from 'util';

import authConfig from '../../config/auth';

export default async (req,res,next)=>{
  const authHeader = req.headers.authorization;

  if(!authHeader){
    return res.status(401).json({error: 'Token não enviado.'});
  }

  //Desestruturando o array split e pegando apenas a informação do token, sem palavra bearer
  const [, token] = authHeader.split(' ');

  try{
    const decoded = await promisify(jwt.verify)(token,authConfig.secret);

    req.userId = decoded.id; //Armazenando o id do usuário na requisição, para não precisar informar id na url
    //console.log(decoded);

    return next();
  }catch(erro){
    return res.status(401).json({error: 'Token inválido.'});
  }

};
