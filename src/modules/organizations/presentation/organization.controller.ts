import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  CurrentUser,
  type JwtUser,
} from '../../../common/decorators/current-user.decorator';
import { CreateOrganizationDto } from './dto/create-organiztion.dto';
import { CreateOrganizationUseCase } from '../application/create-organiztion.usercase';
import { GetCurrentOrganizationUseCase } from '../application/get-current-organization.usecase';
import { UpdateOrganizationUseCase } from '../application/update-organization.usecase';
import { OrganizationPresentationMapper } from './organization.mapper';
import { OrganizationResponseDto } from './dto/organization-response.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Organizations')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('organizations')
export class OrganizationController {
  constructor(
    private readonly createOrganizationUseCase: CreateOrganizationUseCase,
    private readonly getCurrentOrganizationUseCase: GetCurrentOrganizationUseCase,
    private readonly updateOrganizationUseCase: UpdateOrganizationUseCase,
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

  @ApiOperation({ summary: 'Get current organization details' })
  @ApiResponse({
    status: 200,
    description: 'Current organization details.',
    type: OrganizationResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  @Get('me')
  async getMe(@CurrentUser() user: JwtUser) {
    const organization = await this.getCurrentOrganizationUseCase.execute(
      user.organizationId,
    );
    return OrganizationPresentationMapper.toResponse(organization);
  }

  @ApiOperation({ summary: 'Update current organization' })
  @ApiResponse({
    status: 200,
    description: 'Organization updated successfully.',
    type: OrganizationResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  @Patch('me')
  async updateMe(
    @CurrentUser() user: JwtUser,
    @Body() dto: UpdateOrganizationDto,
  ) {
    const organization = await this.updateOrganizationUseCase.execute(
      user.organizationId,
      dto.name,
      dto.logoUrl,
      dto.timezone,
    );
    return OrganizationPresentationMapper.toResponse(organization);
  }
}
