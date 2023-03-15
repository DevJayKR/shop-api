import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as FormData from 'form-data';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { Upload } from './entities/upload.entity';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Upload)
    private uploadRepository: Repository<Upload>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async generateFormData(file: Express.Multer.File) {
    const formData = new FormData();
    formData.append('image', file.buffer.toString('base64'));

    return formData;
  }

  async uploadImageToIMGBB(formData: FormData) {
    const { data } = await firstValueFrom(
      this.httpService.post(
        'https://api.imgbb.com/1/upload?expiration=60&key=' +
          this.configService.get('IMGBB_API_KEY'),
        formData,
      ),
    );

    return data;
  }

  async saveData(id: string, imageData: any, file: Express.Multer.File) {
    const data = this.uploadRepository.create({
      id: id,
      url: imageData.data.url,
      expirationSecond: imageData.data.expiration,
      filename: file.originalname,
    });

    await this.uploadRepository.save(data);
  }
}
