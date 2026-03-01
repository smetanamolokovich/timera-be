import { Organization } from '../domain/organization';
import { OrganizationResponseDto } from './dto/organization-response.dto';

export class OrganizationPresentationMapper {
  static toResponse(organization: Organization): OrganizationResponseDto {
    return {
      id: organization.id,
      name: organization.name,
      ownerId: organization.ownerId,
      address: organization.address,
      phoneNumber: organization.phoneNumber,
      email: organization.email,
      logoUrl: organization.logoUrl,
      isActive: organization.isActive,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
    };
  }
}
