import mongoose from 'mongoose';
import TagSchema from './tag';

const Schema = mongoose.Schema;

/**
 * Task Schema
 */
const TaskSchema = new Schema({
  workflow: {
    type: Schema.ObjectId,
    ref: 'Workflow',
    required: 'Workflow is missing',
  },
  user: {
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
  users: [{
    type: Schema.ObjectId,
    ref: 'User',
  }],
  subTasks: [{
    title: {
      type: String,
      default: '',
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
