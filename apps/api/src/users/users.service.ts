import { User } from '@area/shared';
import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class UsersService {
    async findByEmail(email: string) : Promise<User | undefined> {
        // TODO implements 
        throw new NotImplementedException();
    }
}
