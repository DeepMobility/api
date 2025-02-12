import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { Video } from '../../database/entities/video.entity';

@Injectable()
export class GetMyDashboardUsecase {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Video)
    private videosRepository: Repository<Video>,
  ) {}

  async get(
    userId: string,
  ): Promise<any> {
    const user = await this.usersRepository.findOneBy({ id: userId });

    const videos = await this.videosRepository.find();

    return {
      name: user.firstName,
      jobType: user.jobType,
      videos: videos.map((video) => {
        return {
          id : video.id,
          name: video.name,
          url: video.url,
          thumbnailUrl: video.thumbnailUrl,
          description: video.description,
          duration: video.duration,
          course: video.course,
          coursePosition: video.coursePosition,
          bodyParts: video.bodyParts,
          exerciseTypes: video.exerciseTypes,
        }
      })
    };
  }
}
