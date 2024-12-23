import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServiceModule } from './service/service.module';
import { RepositoryModule } from './repository/repository.module';
import { ControllerModule } from './controller/controller.module';

@Module({
  imports: [ServiceModule, RepositoryModule, ControllerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
