// import {
//   registerDecorator,
//   ValidationOptions,
//   ValidatorConstraint,
//   ValidatorConstraintInterface,
// } from 'class-validator';
// import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
// import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
// import dataSource from '../../../ormconfig';

// @ValidatorConstraint({ name: 'IsNotExist', async: true })
// export class IsNotExistContraint implements ValidatorConstraintInterface {
//   async validate(value: string, validationArguments: ValidationArguments) {
//     const repository = validationArguments
//       .constraints[0] as EntityClassOrSchema;
//     const pathToProperty = validationArguments.constraints[1];

//     const entity = await dataSource
//       .getRepository<typeof repository>(repository)
//       .createQueryBuilder('entity')
//       .where(`entity.${pathToProperty} = :value`, { value })
//       .getCount();

//     return !Boolean(entity);
//   }
// }

// export function IsNotExist(
//   property: {
//     repository: EntityClassOrSchema;
//     pathToProperty?: string;
//   },
//   validationOptions: ValidationOptions = {},
// ) {
//   return (object: any, propertyName: string) => {
//     registerDecorator({
//       name: 'IsNotExist',
//       target: object.constructor,
//       propertyName: propertyName,
//       constraints: [property.repository, property.pathToProperty],
//       options: {
//         message: `${propertyName} already exists`,
//         ...validationOptions,
//       },
//       validator: IsNotExistContraint,
//     });
//   };
// }
