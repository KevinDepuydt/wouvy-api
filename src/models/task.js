import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Task Schema
 * @TODO Rework this schema
 */
const TaskSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  tasks: [{
    type: Schema.ObjectId,
    ref: 'Task',
  }],
  created: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Task', TaskSchema);
