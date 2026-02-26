import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GetInvitationByTokenUseCase } from '../application/get-invitation-by-token.usecase';
import { CreateInvitationUseCase } from '../application/create-invitation.usecase';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  CurrentUser,
  type JwtUser,
} from '../../../common/decorators/current-user.decorator';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { InvitationResponseDto } from './dto/invitation-response.dto';
import { InvitationPresentationMapper } from './invitation.mapper';
import { AccessDeniedError } from '../../../common/errors/access-denied.error';
import { InvalidEnvVarsError } from '../../../common/errors/invalid-env-vars.error';

@ApiTags('invitations')
@Controller('invitations')
export class InvitationController {
  constructor(
    private readonly createInvitationUseCase: CreateInvitationUseCase,
    private readonly getInvitationByTokenUseCase: GetInvitationByTokenUseCase,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create an invitation link for the organization' })
  @ApiResponse({
    status: 201,
    description: 'Invitation created',
    type: InvitationResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @CurrentUser() user: JwtUser,
    @Body() dto: CreateInvitationDto,
  ): Promise<InvitationResponseDto> {
    if (!user.organizationId || !user.id) throw new AccessDeniedError();

    if (!process.env.APP_URL) throw new InvalidEnvVarsError(['APP_URL']);

    const invitation = await this.createInvitationUseCase.execute(
      user.organizationId,
      user.id,
      dto.role,
      dto.invitedEmail,
      dto.expiresInDays,
    );

    return InvitationPresentationMapper.toResponse(invitation);
  }

  @ApiOperation({ summary: 'Get invitation info by token (public)' })
  @ApiResponse({
    status: 200,
    description: 'Invitation info',
    type: InvitationResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Invitation not found or expired' })
  @Get(':token')
  async getByToken(
    @Param('token') token: string,
  ): Promise<InvitationResponseDto> {
    const invitation = await this.getInvitationByTokenUseCase.execute(token);

    return InvitationPresentationMapper.toResponseWithoutToken(invitation);
  }
}
