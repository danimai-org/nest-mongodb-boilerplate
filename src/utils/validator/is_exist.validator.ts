import {
  isUUID,
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import dataSource from '../../../ormconfig';

@ValidatorConstraint({ name: 'IsExist', async: true })
export class IsExistContraint implements ValidatorConstraintInterface {
  async validate(value: string, validationArguments: ValidationArguments) {
    const repository = validationArguments
      .constraints[0] as EntityClassOrSchema;
    const pathToProperty = validationArguments.constraints[1];

    // Check for uuid
    const is_uuid = validationArguments.constraints[2];
    if (is_uuid && !isUUID(value, '4')) {
      return false;
    }

    const entity = await dataSource
      .getRepository<typeof repository>(repository)
      .createQueryBuilder('entity')
      .where(`entity.${pathToProperty} = :value`, { value })
      .getCount();
    return Boolean(entity);
  }
}

export function IsExist(
  property: {
    repository: EntityClassOrSchema;
    pathToProperty?: string;
    uuid?: boolean;
  },
  validationOptions: ValidationOptions = {},
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsExist',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [
        property.repository,
        property.pathToProperty,
        property.uuid,
      ],
      options: {
        message: `${propertyName} does not exists`,
        ...validationOptions,
      },
      validator: IsExistContraint,
    });
  };
}
