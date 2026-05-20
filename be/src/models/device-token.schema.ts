import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DeviceTokenDocument = HydratedDocument<DeviceToken>;

@Schema({
  timestamps: true,
  collection: 'device_tokens',
})
export class DeviceToken {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, trim: true, unique: true })
  expoPushToken: string;

  @Prop({ trim: true, maxlength: 40 })
  deviceId?: string;

  @Prop({ trim: true, maxlength: 20 })
  platform?: string;

  @Prop({ default: true, index: true })
  isActive: boolean;

  @Prop({ required: true, default: Date.now })
  lastSeenAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const DeviceTokenSchema = SchemaFactory.createForClass(DeviceToken);
DeviceTokenSchema.index({ userId: 1, isActive: 1 });
