import mongoose from 'mongoose';

//Criando schema para as notificações
const NotificationSchema = new mongoose.Schema({
  content:{
    type: String,
    required: true,
  },
  user:{
    type: Number,
    required: true,
  },
  read:{
    type: Boolean,
    required: true,
    default: false,
  },
}, {timestamps: true,}); //Criando os campos createAt e updateAt automático

export default mongoose.model('Notification', NotificationSchema);
