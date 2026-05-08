import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

function flattenValidationErrors(
  validationErrors: ValidationError[],
  parentPath = '',
): Array<{ field: string; message: string }> {
  const result: Array<{ field: string; message: string }> = [];
  for (const err of validationErrors) {
    const path = parentPath ? `${parentPath}.${err.property}` : err.property;
    if (err.constraints) {
      result.push({
        field: path,
        message: Object.values(err.constraints).join(', '),
      });
    }
    if (err.children?.length) {
      result.push(...flattenValidationErrors(err.children, path));
    }
  }
  return result;
}

export function validationExceptionFactory(errors: ValidationError[]) {
  return new BadRequestException({
    message: 'Validation failed',
    errors: flattenValidationErrors(errors),
  });
}
