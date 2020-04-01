import Appointment from '../models/Appointment';
import User from '../models/User';
import {startOfDay, parseISO, endOfDay} from 'date-fns';
import {Op} from 'sequelize';

class ScheduleController{
  async index(req,res){

    //Verificando se usuário logado é um provedor de serviço
    const checkUserProvider = await User.findOne({
      where: {
        id: req.userId, provider: true,
      }
    });

    if(!checkUserProvider){
      return res.json({error: 'Usuário não é prestador de serviço.'})
    }

    //Selecionando a data enviada pela requisição
    const {date} = req.query;
    const parsedDate = parseISO(date);

    //Consultando todos os agendamentos na data
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [
            startOfDay(parsedDate),
            endOfDay(parsedDate),
          ],
        },
      },
      order: ['date'],
    });

    return res.json(appointments);
    //return res.json();
  }

}

export default new ScheduleController();
