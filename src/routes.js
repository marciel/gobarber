import {Router} from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users',UserController.store);
routes.post('/sessions',SessionController.store);

routes.get('/', async (req,res)=>{
  return res.json({message: 'GoBarber' });
});

//Utilizando middleware local
//routes.put('/users',authMiddleware, UserController.update);

//Utilizando middleware geral, para todas as rotas abaixo da chamada
routes.use(authMiddleware);
routes.put('/users',UserController.update);

routes.get('/providers',ProviderController.index);

//Criando a rota para recebimento do arquivo de avatar, através do campo file
routes.post('/files',upload.single('file'),FileController.store);

export default routes;
