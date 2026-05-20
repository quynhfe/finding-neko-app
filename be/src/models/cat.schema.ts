import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CatDocument = HydratedDocument<Cat>;

export class CatImage {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  publicId: string;
}

const CatImageSchema = SchemaFactory.createForClass(CatImage);

@Schema({
  timestamps: true,
  collection: 'cats',
})
export class Cat {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  ownerId: Types.ObjectId;

  @Prop({ required: true, trim: true, maxlength: 80 })
  name: string;

  @Prop({ required: true, min: 0, max: 240 })
  ageMonths: number;

  @Prop({ required: true, trim: true, maxlength: 80 })
  breed: string;

  @Prop({ required: true, trim: true, maxlength: 40 })
  furColor: string;

  @Prop({ required: true, trim: true, maxlength: 500 })
  distinctiveFeatures: string;

  @Prop({ type: [CatImageSchema], default: [] })
  images: CatImage[];

  @Prop({ default: false, index: true })
  isLost: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const CatSchema = SchemaFactory.createForClass(Cat);
CatSchema.index({ ownerId: 1 });
