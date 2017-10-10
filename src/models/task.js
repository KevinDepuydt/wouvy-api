import mongoose from 'mongoose';
import env from '../config/env';

const Schema = mongoose.Schema;

const validateTaskStatus = status => env.taskStatus.findIndex(s => s === status) !== -1;

/**
 * Task Schema
 * @TODO Rework this schema
 */
const TaskSchema = new Schema({
  users: [{
    type: Schema.ObjectId,
    ref: 'User',
  }],
  title: {
    type: String,
    required: 'La tâche est vide',
  },
  status: {
    type: Object,
    validate: [validateTaskStatus, 'Le statut de la tâche n\'est pas valide'],
    default: env.taskStatus[0],
  },
  subTasks: [{
    title: {
      type: String,
      required: 'La sous-tâche est vide',
    },
    users: [{
      type: Schema.ObjectId,
      ref: 'User',
    }],
    isDone: {
      type: Boolean,
      default: false,
    },
  }],
  tags: [{
    type: String,
    default: [],
  }],
  deadline: {
    type: Date,
    default: null,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Task', TaskSchema);
