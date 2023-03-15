import {
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guard/jwtAuth.guard';
import { RequestWithUser } from 'src/auth/request-with-user.interface';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('/image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @Req() request: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { user } = request;
    const formData = await this.uploadService.generateFormData(file);
    const imageData = await this.uploadService.uploadImageToIMGBB(formData);
    console.log(imageData.data);

    await this.uploadService.saveData(user.id, imageData, file);
    return imageData;
  }
}
