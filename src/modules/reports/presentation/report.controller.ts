import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { GetProjectReportUseCase } from '../application/get-project-report.usercase';
import { AuthGuard } from '@nestjs/passport';
import {
  CurrentUser,
  type JwtUser,
} from '../../../common/decorators/current-user.decorator';
import { ReportPresentationMapper } from './report.mapper';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiQuery,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from '../../../common/decorators/roles.decorator';
import { OrganizationRoleEnum } from '../../memberships/domain/membership';

@Controller('reports')
export class ReportController {
  constructor(
    private readonly getProjectReportUseCase: GetProjectReportUseCase,
  ) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The project summary report has been successfully retrieved.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden. You do not have access to this project.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Please provide a valid JWT token.',
  })
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  @Roles(OrganizationRoleEnum.OWNER, OrganizationRoleEnum.MANAGER)
  @UseGuards(AuthGuard('jwt'))
  @Get('project-summary')
  async getProjectSummary(
    @CurrentUser() user: JwtUser,
    @Param('projectId') projectId: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    const report = await this.getProjectReportUseCase.execute({
      userId: user.id,
      projectId,
      fromDate: fromDate ? new Date(fromDate) : undefined,
      toDate: toDate ? new Date(toDate) : undefined,
    });

    return ReportPresentationMapper.toProjectSummaryReponse(report);
  }
}
