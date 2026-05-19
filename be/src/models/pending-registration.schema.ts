import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PendingRegistrationDocument = HydratedDocument<PendingRegistration>;

@Schema({
  timestamps: true,
  collection: 'pending_registrations',
})
export class PendingRegistration {
  @Prop({ required: true, lowercase: true, trim: true })
  username: string;

  @Prop({ required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  otpHash: string;

  @Prop({ required: true })
  expiresAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const PendingRegistrationSchema =
  SchemaFactory.createForClass(PendingRegistration);

PendingRegistrationSchema.index({ username: 1 }, { unique: true });
PendingRegistrationSchema.index({ email: 1 }, { unique: true });
PendingRegistrationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
