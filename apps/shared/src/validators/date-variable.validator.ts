import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ async: false })
export class IsDateOrVariableConstraint
  implements ValidatorConstraintInterface
{
  validate(
    value: string,
    args?: ValidationArguments,
  ): Promise<boolean> | boolean {
    if (/{{.*}}/.test(value)) return true;
    if (!isNaN(Date.parse(value))) return true;
    return false;
  }

  defaultMessage(args?: ValidationArguments): string {
    return `${args.property} must be either an ISO date or a variable.`;
  }
}

export function IsDateOrVariable(options?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      validator: IsDateOrVariableConstraint,
      target: object.constructor,
      options: options,
      propertyName: propertyName,
    });
  };
}
