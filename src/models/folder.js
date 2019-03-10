import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Document Schema
 */
const FolderSchema = new Schema({
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
    required: 'Saisissez le nom du dossier',
  },
  documents: [{
    type: Schema.ObjectId,
    ref: 'Document',
    default: [],
  }],
  folders: [{
    type: Schema.ObjectId,
    ref: 'Folder',
    default: [],
  }],
  isRoot: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Folder', FolderSchema);
