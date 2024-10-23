import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({async: false})
export class IsNumberOrVariableConstraint implements ValidatorConstraintInterface {
    validate(value: any, args?: ValidationArguments): Promise<boolean> | boolean {
        if (typeof(value) == 'string') {
            // May be a variable
            return /{{.*}}/.test(value);
        }
        if (typeof(value) == 'number') {
            const min: number | undefined = args.constraints[0];
            return !min || value >= min;
        }
        return false;
    }

    defaultMessage(args?: ValidationArguments): string {
        return `${args.property} must be either a number or a variable.`
    }
}

export function IsNumberOrVariable(min?: number, options?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            validator: IsNumberOrVariableConstraint,
            target: object.constructor,
            options: options,
            propertyName: propertyName,
            constraints: [min]
        });
    }
}
