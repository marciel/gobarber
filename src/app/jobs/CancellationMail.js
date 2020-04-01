import Mail from '../../lib/Mail';
import {format, parseISO} from 'date-fns';
import pt from 'date-fns/locale/pt';

class CancellationMail{
  get key(){
    return 'CancellationMail';
  }

  async handle({data}){
    const {appointment} = data;

    //Formatando a data
    const formattedDate = format(
      appointment.date,
      "'dia' dd 'de' MMMM', às 'H:mm'h'",
      {locale: pt},
    );

    //Código para envio de e-mail
    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      //to: 'teste <teste@teste.com.br>',
      subject: 'Agendamento Cancelado',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: parseIso(formattedDate),
      },
    });
  }
}

export default new CancellationMail();
