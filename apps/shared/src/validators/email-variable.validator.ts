import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ async: false })
export class IsEmailOrVariableConstraint
  implements ValidatorConstraintInterface
{
  validate(
    value: string,
    args?: ValidationArguments,
  ): Promise<boolean> | boolean {
    if (/{{.*}}/.test(value)) return true;
    if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
      // Email Regex
      return true;
    }
    return false;
  }

  defaultMessage(args?: ValidationArguments): string {
    return `${args.property} must be either an email or a variable.`;
  }
}

export function IsEmailOrVariable(options?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      validator: IsEmailOrVariableConstraint,
      target: object.constructor,
      options: options,
      propertyName: propertyName,
    });
  };
}
