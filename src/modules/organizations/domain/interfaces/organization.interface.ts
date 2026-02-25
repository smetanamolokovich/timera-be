import { Organization } from '../organization';

export interface OrganizationRepository {
  save(organization: Organization): Promise<void>;
}
