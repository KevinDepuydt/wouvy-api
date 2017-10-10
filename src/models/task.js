import mongoose from 'mongoose';
// import env from '../config/env';

const Schema = mongoose.Schema;

// const validateTaskStatus = status => env.taskStatus.findIndex(s => s === status) !== -1;

/**
 * Task Schema
 */
const TaskSchema = new Schema({
  title: {
    type: String,
    required: 'La tâche est vide',
  },
  description: {
    type: String,
    default: '',
  },
  isDone: {
    type: Boolean,
    default: false,
  },
  users: [{
    type: Schema.ObjectId,
    ref: 'User',
  }],
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
