import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dialect } from 'sequelize/types';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // set data source time zone for sequelize
        process.env.TZ = configService.get<string>('APP_TIMEZONE');

        return {
          dialect: configService.get<Dialect>('DATABASE_DIALECT'),
          storage: configService.get<string>('DATABASE_STORAGE'),
          host: configService.get<string>('DATABASE_HOST'),
          port: +configService.get<number>('DATABASE_PORT'),
          username: configService.get<string>('DATABASE_USER'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_SCHEMA'),
          synchronize:
            configService.get<string>('DATABASE_SYNCHRONIZE') === 'true'
              ? true
              : false,
          logging:
            configService.get<string>('DATABASE_LOGGIN') === 'true'
              ? console.log
              : false,
          autoLoadModels: true,
          models: [],
        };
      },
    }),
  ],
  exports: [SequelizeModule],
})
export class SequelizeConfigModule {}
