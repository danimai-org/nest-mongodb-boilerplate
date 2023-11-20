// import { Injectable } from '@nestjs/common';
// import {
//   isUUID,
//   registerDecorator,
//   ValidationOptions,
//   ValidatorConstraint,
//   ValidatorConstraintInterface,
// } from 'class-validator';
// import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
// import { Model, Types } from 'mongoose';

// @ValidatorConstraint({ name: 'IsExist', async: true })
// @Injectable()
// export class IsExistConstraint implements ValidatorConstraintInterface {
//   async validate(value: string, validationArguments: ValidationArguments) {
//     const repository = validationArguments.constraints[0] as Model<any>;
//     const pathToProperty = validationArguments.constraints[1];

//     // Check for uuid
//     const checkUUID = validationArguments.constraints[2];
//     const checkObjectID = validationArguments.constraints[3];
//     if (checkUUID && !isUUID(value, '4')) {
//       return false;
//     }
//     if (checkObjectID && !Types.ObjectId.isValid(value)) {
//       return false;
//     }

//     const entity = await dataSource
//       .getRepository<typeof repository>(repository)
//       .createQueryBuilder('entity')
//       .where(`entity.${pathToProperty} = :value`, { value })
//       .getCount();
//     return Boolean(entity);
//   }
// }

// export function IsExist<T>(
//   {
//     repository,
//     filterField = '_id',
//     uuid,
//     objectID,
//   }: {
//     repository: Model<T>;
//     filterField?: string;
//     uuid?: boolean;
//     objectID?: boolean;
//   },
//   validationOptions: ValidationOptions = {},
// ) {
//   return (object: any, propertyName: string) => {
//     registerDecorator({
//       name: 'IsExist',
//       target: object.constructor,
//       propertyName: propertyName,
//       constraints: [repository, filterField, objectID, uuid],
//       options: {
//         message: `${propertyName} does not exists`,
//         ...validationOptions,
//       },
//       validator: IsExistConstraint,
//     });
//   };
// }
