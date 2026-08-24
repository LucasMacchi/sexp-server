import { Module } from '@nestjs/common';
import { ExpedienteController } from './expediente.controller';
import { ExpedienteService } from './expediente.service';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports:[HttpModule],
  controllers: [ExpedienteController],
  providers: [ExpedienteService]
})
export class ExpedienteModule {}
