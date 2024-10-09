import { SendingMethod } from '@area/shared';

export type SendingMethodFunction = (data: SendingMethod, title: string, body: string) => Promise<boolean>;
