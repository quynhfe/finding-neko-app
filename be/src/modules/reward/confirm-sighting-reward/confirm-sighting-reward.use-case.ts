import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PushNotificationService } from '../../../common/services/push-notification.service';
import {
  CatSighting,
  CatSightingDocument,
} from '../../../models/cat-sighting.schema';
import { Cat, CatDocument } from '../../../models/cat.schema';
import {
  LostCatReport,
  LostCatReportDocument,
} from '../../../models/lost-cat-report.schema';
import {
  Notification,
  NotificationDocument,
} from '../../../models/notification.schema';
import {
  StarReward,
  StarRewardDocument,
} from '../../../models/star-reward.schema';
import { ConfirmSightingRewardResponseDto } from './dto/confirm-sighting-reward.response.dto';

interface RequestUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

const FOUND_LOST_CAT_STARS = 100;

@Injectable()
export class ConfirmSightingRewardUseCase {
  constructor(
    @InjectModel(CatSighting.name)
    private readonly catSightingModel: Model<CatSightingDocument>,
    @InjectModel(LostCatReport.name)
    private readonly lostCatReportModel: Model<LostCatReportDocument>,
    @InjectModel(Cat.name) private readonly catModel: Model<CatDocument>,
    @InjectModel(StarReward.name)
    private readonly starRewardModel: Model<StarRewardDocument>,
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  async execute(
    sightingId: string,
    lostCatReportId: string,
    user: RequestUser,
  ): Promise<ConfirmSightingRewardResponseDto> {
    if (
      !Types.ObjectId.isValid(sightingId) ||
      !Types.ObjectId.isValid(lostCatReportId)
    ) {
      throw new BadRequestException('ID không hợp lệ');
    }

    const sightingObjectId = new Types.ObjectId(sightingId);
    const reportObjectId = new Types.ObjectId(lostCatReportId);
    const ownerObjectId = new Types.ObjectId(user.id);

    const report = await this.lostCatReportModel.findOne({
      _id: reportObjectId,
      ownerId: ownerObjectId,
    });

    if (!report) {
      throw new NotFoundException('Không tìm thấy tin mèo lạc');
    }

    if (report.status !== 'active') {
      throw new BadRequestException('Tin mèo lạc này đã được xử lý');
    }

    const sighting = await this.catSightingModel.findOne({
      _id: sightingObjectId,
      'candidates.lostCatReportId': reportObjectId,
      'candidates.ownerId': ownerObjectId,
    });

    if (!sighting) {
      throw new NotFoundException('Không tìm thấy báo cáo thấy mèo phù hợp');
    }

    if (sighting.reporterId.equals(ownerObjectId)) {
      throw new BadRequestException('Không thể tự thưởng sao cho chính mình');
    }

    const existingReward = await this.starRewardModel.exists({
      lostCatReportId: reportObjectId,
    });

    if (existingReward) {
      throw new BadRequestException('Tin mèo lạc này đã được thưởng sao');
    }

    const now = new Date();
    report.status = 'resolved';
    report.resolvedAt = now;
    await report.save();

    await this.catModel.updateOne(
      { _id: report.catId, ownerId: ownerObjectId },
      { $set: { isLost: false } },
    );

    await this.catSightingModel.updateOne(
      { _id: sightingObjectId, 'candidates.lostCatReportId': reportObjectId },
      {
        $set: {
          'candidates.$.status': 'confirmed',
        },
      },
    );

    const reward = await this.starRewardModel.create({
      recipientId: sighting.reporterId,
      awardedBy: ownerObjectId,
      catId: report.catId,
      lostCatReportId: reportObjectId,
      sightingId: sightingObjectId,
      stars: FOUND_LOST_CAT_STARS,
      reason: 'found_lost_cat',
    });

    await this.notifyRewardRecipient(reward, user);

    return {
      success: true,
      reward: {
        id: reward._id.toString(),
        recipientId: reward.recipientId.toString(),
        awardedBy: reward.awardedBy.toString(),
        catId: reward.catId.toString(),
        lostCatReportId: reward.lostCatReportId.toString(),
        sightingId: reward.sightingId.toString(),
        stars: reward.stars,
        reason: reward.reason,
        createdAt: reward.createdAt,
        updatedAt: reward.updatedAt,
      },
    };
  }

  private async notifyRewardRecipient(
    reward: StarRewardDocument,
    user: RequestUser,
  ): Promise<void> {
    const notification = await this.notificationModel.create({
      recipientId: reward.recipientId,
      actorId: new Types.ObjectId(user.id),
      type: 'star_rewarded',
      title: 'Bạn vừa được cộng sao',
      body: `${user.fullName || user.username} đã xác nhận bạn giúp tìm thấy mèo và thưởng ${reward.stars} sao.`,
      data: {
        rewardId: reward._id.toString(),
        catId: reward.catId.toString(),
        lostCatReportId: reward.lostCatReportId.toString(),
        sightingId: reward.sightingId.toString(),
        stars: reward.stars,
      },
    });

    await this.pushNotificationService.sendToUser({
      recipientId: notification.recipientId,
      title: notification.title,
      body: notification.body,
      data: {
        notificationId: notification._id.toString(),
        type: notification.type,
        ...notification.data,
      },
    });
  }
}
