import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type StarRewardDocument = HydratedDocument<StarReward>;

export type StarRewardReason = 'found_lost_cat';

@Schema({
  timestamps: true,
  collection: 'star_rewards',
})
export class StarReward {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  recipientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  awardedBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  catId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  lostCatReportId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  sightingId: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  stars: number;

  @Prop({ required: true, enum: ['found_lost_cat'], default: 'found_lost_cat' })
  reason: StarRewardReason;

  createdAt: Date;
  updatedAt: Date;
}

export const StarRewardSchema = SchemaFactory.createForClass(StarReward);
StarRewardSchema.index({ recipientId: 1, createdAt: -1 });
StarRewardSchema.index({ createdAt: -1 });
StarRewardSchema.index({ lostCatReportId: 1 }, { unique: true });
