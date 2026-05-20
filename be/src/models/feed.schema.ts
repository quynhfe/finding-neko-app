import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type FeedDocument = HydratedDocument<Feed>;

export class FeedImage {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  publicId: string;
}

const FeedImageSchema = SchemaFactory.createForClass(FeedImage);

export class FeedReaction {
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, trim: true, maxlength: 40 })
  type: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;
}

const FeedReactionSchema = SchemaFactory.createForClass(FeedReaction);

@Schema({
  timestamps: true,
  collection: 'feeds',
})
export class Feed {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  ownerId: Types.ObjectId;

  @Prop({ required: true, trim: true, maxlength: 280 })
  caption: string;

  @Prop({ type: [Types.ObjectId], required: true, default: [], index: true })
  catIds: Types.ObjectId[];

  @Prop({ type: FeedImageSchema, required: true })
  image: FeedImage;

  @Prop({ type: [FeedReactionSchema], default: [] })
  reactions: FeedReaction[];

  createdAt: Date;
  updatedAt: Date;
}

export const FeedSchema = SchemaFactory.createForClass(Feed);
FeedSchema.index({ ownerId: 1, createdAt: -1 });
FeedSchema.index({ catIds: 1, createdAt: -1 });
