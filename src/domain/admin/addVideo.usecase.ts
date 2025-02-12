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
    name: string,
    url: string,
    thumbnailUrl: string,
    description: string,
    duration: number,
    course: string,
    coursePosition: number,
    bodyParts: string[],
    exerciseTypes: string[],
  ): Promise<any> {
    return this.videosRepository.save({
      name,
      url,
      thumbnailUrl,
      description,
      duration,
      course,
      coursePosition,
      bodyParts,
      exerciseTypes,
    });
  }
}
