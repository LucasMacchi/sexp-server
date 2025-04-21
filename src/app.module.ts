import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { ExpedienteController } from './expediente/expediente.controller';
import { ExpedienteService } from './expediente/expediente.service';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { ExpedienteModule } from './expediente/expediente.module';
import { DataModule } from './data/data.module';

@Module({
  imports: [UserModule, ExpedienteModule, DataModule],
  controllers: [AppController, UserController, ExpedienteController],
  providers: [AppService, ExpedienteService, UserService],
})
export class AppModule {}
