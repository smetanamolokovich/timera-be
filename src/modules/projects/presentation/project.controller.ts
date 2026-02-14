import { Body, Controller, Post } from '@nestjs/common';
import { CreateProjectUseCase } from '../application/create-project.usecase';
import { CreateProjectDto } from './dto/create-project.dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly createProjectUseCase: CreateProjectUseCase) {}

  @Post()
  async createProject(@Body() dto: CreateProjectDto) {
    return this.createProjectUseCase.execute(dto.userId, dto.name);
  }
}
