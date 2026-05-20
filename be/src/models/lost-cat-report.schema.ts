import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type LostCatReportDocument = HydratedDocument<LostCatReport>;

export type LostCatReportStatus = 'active' | 'resolved' | 'cancelled';

export class LostCatLocation {
  @Prop({ required: true, enum: ['Point'], default: 'Point' })
  type: 'Point';

  @Prop({ type: [Number], required: true })
  coordinates: [number, number];
}

const LostCatLocationSchema = SchemaFactory.createForClass(LostCatLocation);

@Schema({
  timestamps: true,
  collection: 'lost_cat_reports',
})
export class LostCatReport {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  catId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  ownerId: Types.ObjectId;

  @Prop({ required: true, trim: true, maxlength: 200 })
  locationText: string;

  @Prop({ type: LostCatLocationSchema, required: true, index: '2dsphere' })
  location: LostCatLocation;

  @Prop({ required: true, trim: true, maxlength: 1000 })
  description: string;

  @Prop({ required: true, enum: ['active', 'resolved', 'cancelled'], default: 'active' })
  status: LostCatReportStatus;

  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const LostCatReportSchema = SchemaFactory.createForClass(LostCatReport);
LostCatReportSchema.index(
  { catId: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: 'active' },
  },
);
LostCatReportSchema.index({ ownerId: 1, createdAt: -1 });
LostCatReportSchema.index({ status: 1, createdAt: -1 });
