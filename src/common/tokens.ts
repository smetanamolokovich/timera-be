export const REPOSITORY_TOKENS = {
  ProjectRepository: Symbol('ProjectRepository'),
  EmployeeRepository: Symbol('EmployeeRepository'),
  TimeEntryRepository: Symbol('TimeEntryRepository'),
  ReportRepository: Symbol('ReportRepository'),
  UserRepository: Symbol('UserRepository'),
  WorkTypeRepository: Symbol('WorkTypeRepository'),
} as const;

export const SERVICE_TOKENS = {
  PasswordHasher: Symbol('PasswordHasher'),
} as const;
