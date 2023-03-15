import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from './entities/upload.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    TypeOrmModule.forFeature([Upload]),
    AuthModule,
  ],
  providers: [UploadService],
  controllers: [UploadController],
})
export class UploadModule {}
