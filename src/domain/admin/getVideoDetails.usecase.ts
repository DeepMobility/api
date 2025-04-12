import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from '../../database/entities/video.entity';

@Injectable()
export class GetVideoDetailsUsecase {
  constructor(
    @InjectRepository(Video)
    private videosRepository: Repository<Video>,
  ) {}

  get(videoId: number): Promise<any> {
    return this.videosRepository.findOne({
      where: { id: videoId },
    });
  }
}
