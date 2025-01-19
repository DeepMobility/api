import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const ADMIN_ONLY = 'adminOnly';
export const Admin = () => SetMetadata(ADMIN_ONLY, true);
