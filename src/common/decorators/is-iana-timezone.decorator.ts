import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsIANATimezone(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isIANATimezone',
      target: (object as { constructor: Function }).constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'string') return false;
          try {
            Intl.DateTimeFormat(undefined, { timeZone: value });
            return true;
          } catch {
            return false;
          }
        },
        defaultMessage() {
          return `$property must be a valid IANA timezone (e.g. "America/New_York", "UTC")`;
        },
      },
    });
  };
}
