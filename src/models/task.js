import mongoose from 'mongoose';
// import env from '../config/env';
import TagSchema from './tag';

const Schema = mongoose.Schema;

// const validateTaskStatus = status => env.taskStatus.findIndex(s => s === status) !== -1;

/**
 * Task Schema
 */
const TaskSchema = new Schema({
  owner: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: 'La tâche est vide',
  },
  description: {
    type: String,
    default: '',
  },
  done: {
    type: Boolean,
    default: false,
  },
  members: [{
    type: Schema.ObjectId,
    ref: 'Member',
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
    done: {
      type: Boolean,
      default: false,
    },
  }],
  tags: [TagSchema],
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
