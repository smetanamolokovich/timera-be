import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  CurrentUser,
  type JwtUser,
} from '../../../common/decorators/current-user.decorator';
import { CreateOrganizationDto } from './dto/create-organiztion.dto';
import { CreateOrganizationUseCase } from '../application/create-organiztion.usercase';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Organizations')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('organizations')
export class OrganizationController {
  constructor(
    private readonly createOrganizationUseCase: CreateOrganizationUseCase,
  ) {}

  @ApiOperation({ summary: 'Create a new organization' })
  @ApiResponse({
    status: 201,
    description: 'Organization created successfully.',
  })
  @Post()
  async create(
    @CurrentUser() user: JwtUser,
    @Body() dto: CreateOrganizationDto,
  ) {
    return this.createOrganizationUseCase.execute(
      user.id,
      dto.name,
      dto.address,
      dto.phoneNumber,
      dto.email,
      dto.logoUrl,
      dto.isActive,
    );
  }
}
