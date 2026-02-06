import { CustomDecorator, SetMetadata } from '@nestjs/common';

/**
 * Set permissions in metadata to be available in authorization guard
 * @param permissions string[]
 * @returns CustomDecorator<K>
 */
export const Permissions = (...permissions: string[]): CustomDecorator =>
  SetMetadata('permissions', permissions);
