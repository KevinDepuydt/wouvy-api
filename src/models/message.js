import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Message Schema
 */
const MessageSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    default: '',
  },
  attachment: {
    type: String,
    default: null,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Hook a pre save method to hash the password
 */
MessageSchema.post('remove', function postRemove() {
  if (this.attachment) {
    const filepath = path.join(__dirname, '..', '..', 'public', 'uploads', this.attachment);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  }
});

export default mongoose.model('Message', MessageSchema);
