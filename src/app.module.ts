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
import { TicketsController } from './tickets/tickets.controller';
import { TicketsModule } from './tickets/tickets.module';
import { TicketsService } from './tickets/tickets.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [UserModule, ExpedienteModule, DataModule, TicketsModule,HttpModule],
  controllers: [AppController, UserController, ExpedienteController, TicketsController],
  providers: [AppService, ExpedienteService, UserService, TicketsService],
})
export class AppModule {}
