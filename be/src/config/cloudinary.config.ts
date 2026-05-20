import { ConfigService } from '@nestjs/config';

export interface CloudinaryConfig {
  cloudName?: string;
  apiKey?: string;
  apiSecret?: string;
  catFolder: string;
  feedFolder: string;
  sightingFolder: string;
  secure: boolean;
}

export const cloudinaryConfig = (
  configService: ConfigService,
): CloudinaryConfig => {
  const cloudinaryUrl = configService.get<string>('CLOUDINARY_URL');
  const parsedUrl = parseCloudinaryUrl(cloudinaryUrl);

  return {
    cloudName:
      configService.get<string>('CLOUDINARY_CLOUD_NAME') ?? parsedUrl?.cloudName,
    apiKey: configService.get<string>('CLOUDINARY_API_KEY') ?? parsedUrl?.apiKey,
    apiSecret:
      configService.get<string>('CLOUDINARY_API_SECRET') ?? parsedUrl?.apiSecret,
    catFolder: configService.get<string>('CLOUDINARY_CAT_FOLDER', 'finding-neko/cats'),
    feedFolder: configService.get<string>(
      'CLOUDINARY_FEED_FOLDER',
      'finding-neko/feeds',
    ),
    sightingFolder: configService.get<string>(
      'CLOUDINARY_SIGHTING_FOLDER',
      'finding-neko/sightings',
    ),
    secure: true,
  };
};

const parseCloudinaryUrl = (
  cloudinaryUrl: string | undefined,
):
  | {
      cloudName: string;
      apiKey: string;
      apiSecret: string;
    }
  | undefined => {
  if (!cloudinaryUrl) {
    return undefined;
  }

  try {
    const url = new URL(cloudinaryUrl);
    if (url.protocol !== 'cloudinary:') {
      return undefined;
    }

    return {
      cloudName: url.hostname,
      apiKey: decodeURIComponent(url.username),
      apiSecret: decodeURIComponent(url.password),
    };
  } catch {
    return undefined;
  }
};
