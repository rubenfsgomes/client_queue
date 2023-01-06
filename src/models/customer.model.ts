import * as mongoose from 'mongoose';

export const CustomerSchema = new mongoose.Schema({
  name: String,
  priority: Number,
});

export interface Customer extends mongoose.Document {
  id: string;
  name: string;
  priority: number;
}