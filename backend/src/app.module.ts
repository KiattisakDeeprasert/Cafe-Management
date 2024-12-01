import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './app/config/configuration';
import { MulterModule } from '@nestjs/platform-express';
import { storageConfig } from './app/config/storage.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('database'),
      }),
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          rootPath: join(__dirname, '..', '..', 'uploads'),
          serveRoot: config.get('upload.apiPath'),
        },
      ],
    }),
    MulterModule.register({ storage: storageConfig }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
