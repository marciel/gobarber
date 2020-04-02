import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import * as Yup from 'yup';
import {startOfHour, parseISO, isBefore, format, subHours} from 'date-fns';
import Notification from '../schemas/Notification';
import pt from 'date-fns/locale/pt';
import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class AppointmentController{
  async index(req,res){
    const {page = 1} = req.query;

    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null,
      },
      order: ['date'],
      attributes: ['id','date','past','cancelable'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: "provider",
          attributes: ['id','name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id','path','url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }


  async store(req,res){
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Dados inválidos.'});
    }

    const {provider_id, date} = req.body;

    /*
    Verificando se o id é um provedor de serviço
    */
    const isProvider = await User.findOne({
      where: {id: provider_id, provider: true},
    });

    if(!isProvider){
      return res.status(400).json({error: 'Não é possível criar o agendamento, prestador de serviço não encontrado ou não é um prestador válido.'});
    }

    const hourStart = startOfHour(parseISO(date));

    //Verificando se para o agendamento foi colocado uma data horário que já passou
    if(isBefore(hourStart, new Date())){
      return res.status(400).json({error: 'Não é permitido agendar para data e horário já passados.'});
    }

    //Verificando se o prestador de serviço já possui agendamento na data horário informado
    const isAgendado = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if(isAgendado){
      return res.status(400).json({error: 'A data horário já possui agendamento.'});
    }

    //Criando o agendamento
    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart, //Agendando apenas para horários inteiros, sem ser quebrado
    });

    /*
      Notificar o prestador de serviço
    */
    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às 'H:mm'h'",
      {locale: pt},
    );
    await Notification.create({
      content: `Novo agendamento de ${user.name} para o ${formattedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }

  async delete(req,res){
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name','email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        }
      ],
    });

    //Verificando se o usuário logado é o mesmo que o prestador de serviço
    if(appointment.user_id != req.userId){
      return res.status(401).json({error: 'Você não tem permissão para cancelar este agendamento.'});
    }

    const dateWithSub = subHours(appointment.date,2);//Removendo duas horas do agendamento
    if(isBefore(dateWithSub, new Date())){ //Verificando se a data atual já passou de duas horas a menos para poder cancelar
      return res.status(401).json({error: 'Você só pode cancelar agendamentos 2 horas antes.'});
    }

    //Incluindo a data de cancelamento
    appointment.canceled_at = new Date();

    //Salvando a informação
    await appointment.save();

    //console.log('passou 1');

    //Cadastrando fila de e-mails
    await Queue.add(CancellationMail.key, {
      appointment,
    });

    //console.log('passou 2');

    return res.json(appointment);
  }

}

export default new AppointmentController();
