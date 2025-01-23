import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from '../../database/entities/video.entity';

@Injectable()
export class GetAllVideosUsecase {
  constructor(
    @InjectRepository(Video)
    private videosRepository: Repository<Video>,
  ) {}

  getAll(): Promise<any[]> {
    return this.videosRepository.find();
  }
}
