import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CatSightingDocument = HydratedDocument<CatSighting>;

export type SightingCandidateStatus =
  | 'pending_owner_review'
  | 'confirmed'
  | 'rejected';

export class CatSightingImage {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  publicId: string;
}

const CatSightingImageSchema = SchemaFactory.createForClass(CatSightingImage);

export class CatSightingLocation {
  @Prop({ required: true, enum: ['Point'], default: 'Point' })
  type: 'Point';

  @Prop({ type: [Number], required: true })
  coordinates: [number, number];
}

const CatSightingLocationSchema =
  SchemaFactory.createForClass(CatSightingLocation);

export class SightingCandidate {
  @Prop({ type: Types.ObjectId, required: true })
  lostCatReportId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  catId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  ownerId: Types.ObjectId;

  @Prop({ required: true, min: 0 })
  distanceMeters: number;

  @Prop({
    required: true,
    enum: ['pending_owner_review', 'confirmed', 'rejected'],
    default: 'pending_owner_review',
  })
  status: SightingCandidateStatus;
}

const SightingCandidateSchema = SchemaFactory.createForClass(SightingCandidate);

@Schema({
  timestamps: true,
  collection: 'cat_sightings',
})
export class CatSighting {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  reporterId: Types.ObjectId;

  @Prop({ type: CatSightingImageSchema, required: true })
  image: CatSightingImage;

  @Prop({ required: true, trim: true, maxlength: 200 })
  locationText: string;

  @Prop({ type: CatSightingLocationSchema, required: true, index: '2dsphere' })
  location: CatSightingLocation;

  @Prop({ trim: true, maxlength: 1000, default: '' })
  description: string;

  @Prop({ type: [SightingCandidateSchema], default: [] })
  candidates: SightingCandidate[];

  createdAt: Date;
  updatedAt: Date;
}

export const CatSightingSchema = SchemaFactory.createForClass(CatSighting);
CatSightingSchema.index({ reporterId: 1, createdAt: -1 });
CatSightingSchema.index({ createdAt: -1 });
