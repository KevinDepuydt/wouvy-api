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
  private: {
    type: Boolean,
    default: false,
  },
  progress: {
    type: Number,
    default: 0,
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
    members: [{
      type: Schema.ObjectId,
      ref: 'Member',
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

/**
 * Hook a post remove method
 */
TaskSchema.pre('save', function preSave(next) {
  // compute task progress
  this.progress = this.done
    ? 100
    : this.subTasks.length > 0
      ? Math.floor(((this.subTasks.filter(t => t.done).length * 100) / this.subTasks.length))
      : 0;
  next();
});

export default mongoose.model('Task', TaskSchema);
