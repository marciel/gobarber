import multer from 'multer';
import crypto from 'crypto';
import {extname, resolve} from 'path';

export default{
  storage: multer.diskStorage({
    destination: resolve(__dirname,'..','..','tmp','uploads'),
    filename: (req,file,cb) =>{
      crypto.randomBytes(16,(err,res)=>{
        //Se gerou erro, retorna ifnromação do erro
        if(err) return cb(err);
        //Retornando com string aleatória mais a extansão do nome do arquivo enviado
        return cb(null,res.toString('hex') + extname(file.originalname));
      });
    }
  }),
};
