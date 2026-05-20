import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

export type NotificationType = 'cat_sighting_match' | 'star_rewarded';

@Schema({
  timestamps: true,
  collection: 'notifications',
})
export class Notification {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  recipientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  actorId: Types.ObjectId;

  @Prop({ required: true, enum: ['cat_sighting_match', 'star_rewarded'] })
  type: NotificationType;

  @Prop({ required: true, trim: true, maxlength: 120 })
  title: string;

  @Prop({ required: true, trim: true, maxlength: 500 })
  body: string;

  @Prop({ type: MongooseSchema.Types.Mixed, default: {} })
  data: Record<string, unknown>;

  @Prop()
  readAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.index({ recipientId: 1, readAt: 1, createdAt: -1 });
