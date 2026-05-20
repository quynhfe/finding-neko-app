import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';
import { CloudinaryConfig, cloudinaryConfig } from '../../config/cloudinary.config';

export interface UploadedImage {
  url: string;
  publicId: string;
}

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  private isConfigured = false;
  private readonly config: CloudinaryConfig;

  constructor(configService: ConfigService) {
    this.config = cloudinaryConfig(configService);
  }

  async uploadCatImages(files: Express.Multer.File[]): Promise<UploadedImage[]> {
    if (!files || files.length === 0) {
      return [];
    }

    const results = await Promise.all(
      files.map((file) => this.uploadImage(file, this.config.catFolder)),
    );

    return results;
  }

  async uploadFeedImage(file: Express.Multer.File): Promise<UploadedImage> {
    return this.uploadImage(file, this.config.feedFolder);
  }

  async uploadSightingImage(file: Express.Multer.File): Promise<UploadedImage> {
    return this.uploadImage(file, this.config.sightingFolder);
  }

  async deleteImages(publicIds: string[]): Promise<void> {
    if (!publicIds.length) {
      return;
    }

    this.ensureConfigured();
    await Promise.all(publicIds.map((publicId) => this.deleteImage(publicId)));
  }

  private async uploadImage(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadedImage> {
    this.ensureConfigured();
    const result = await this.uploadBuffer(file, folder);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  private ensureConfigured(): void {
    if (this.isConfigured) {
      return;
    }

    if (!this.config.cloudName || !this.config.apiKey || !this.config.apiSecret) {
      throw new InternalServerErrorException('Cloudinary chưa được cấu hình');
    }

    cloudinary.config({
      cloud_name: this.config.cloudName,
      api_key: this.config.apiKey,
      api_secret: this.config.apiSecret,
      secure: this.config.secure,
    });
    this.isConfigured = true;
  }

  private uploadBuffer(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error || !result) {
            this.logger.error(
              `Cloudinary upload failed: ${error?.message ?? 'No upload result'}`,
            );
            reject(error ?? new Error('Upload failed'));
            return;
          }
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  private deleteImage(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error) => {
        if (error) {
          this.logger.error(`Cloudinary delete failed: ${error.message}`);
          reject(error);
          return;
        }

        resolve();
      });
    });
  }
}
