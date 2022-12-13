import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsPasswordConstraint implements ValidatorConstraintInterface {
  validate(password: string) {
    const pattern = new RegExp(
      `^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%&? "]).*$`,
    );
    return pattern.test(password);
  }
}

export function IsPassword(validationOptions: ValidationOptions = {}) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `Password should be 8 character with Alphabets, numberd and special characters(!@#$%&? ")`,
        ...validationOptions,
      },
      validator: IsPasswordConstraint,
    });
  };
}
