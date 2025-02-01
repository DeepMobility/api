import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from '../../database/entities/video.entity';

@Injectable()
export class AddVideoUsecase {
  constructor(
    @InjectRepository(Video)
    private videosRepository: Repository<Video>,
  ) {}

  add(
    url: string,
    thumbnailUrl: string,
    name: string,
    description: string,
    duration: number,
    course: string,
    coursePosition: number,
  ): Promise<any> {
    return this.videosRepository.save({ url, thumbnailUrl, name, description, duration, course, coursePosition });
  }
}
