import { Area, User, UserRegistrationDto, TokenDto, AuthorizationDto, AuthorizationsTypes } from '@area/shared';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async createUser(dto: UserRegistrationDto): Promise<User> {
        dto.password = await bcrypt.hash(dto.password, 10);
        const user = new this.userModel(dto);
        return await user.save();
    }

    //TODO: rename with google
    async findOrCreateUser(userData: { email: string; first_name: string; last_name: string; token: TokenDto }): Promise<User> {
        const user = await this.userModel.findOne({ email: userData.email });
        if (user) {
            const authIndex = user.authorizations.findIndex((auth) => auth.type === AuthorizationsTypes.GOOGLE);
            if (authIndex !== -1) {
                user.authorizations[authIndex].data = userData.token;
            } else {
                user.authorizations.push({
                    type: AuthorizationsTypes.GOOGLE,
                    data: userData.token,
                });
            }
            return await user.save();
        }

        const newUser = new this.userModel({
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            authorizations: [
                {
                    type: AuthorizationsTypes.GOOGLE,
                    data: userData.token,
                },
            ],
        });
        return await newUser.save();
    }

    async findById(id: string | ObjectId): Promise<User | undefined> {
        return await this.userModel.findById(id).exec();
    }

    async getUserAuthorization(req: Request): Promise<string[]> {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            console.error('Token missing or invalid');
            throw new UnauthorizedException('Invalid token');
        }

        let tokenPayload: any;
        try {
            tokenPayload = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            console.error('Error while verifying the token:', error);
            throw new UnauthorizedException('Invalid token');
        }

        const id = tokenPayload.sub;
        const user: User | null = await this.userModel.findById(id);

        if (!user) {
            console.error('User not found');
            throw new UnauthorizedException('Invalid user');
        }

        return user.authorizations.map((auth) => auth.type);
    }

    async findByEmail(email: string): Promise<User | undefined> {
        return await this.userModel.findOne({ email: email }).exec();
    }

    /** AREA RELATER */

    async getUserArea(user: { sub: string }, id: ObjectId): Promise<Area> {
        const u = await this.userModel.findById(user.sub);
        const area = u.areas.find((a) => a._id.equals(id));
        if (!area) throw new NotFoundException('Area Not Found.');
        return area;
    }

    async addAreaToUser(user: { sub: string }, area: Area): Promise<User> {
        const u = await this.userModel.findById(user.sub);
        u.areas.push(area);
        return await u.save();
    }

    async removeAreaFromUser(user: { sub: string }, id: ObjectId): Promise<User> {
        const u = await this.userModel.findById(user.sub);
        if (!u.areas.find((a) => a._id.equals(id))) throw new NotFoundException('Area Not Found.');
        u.areas = u.areas.filter((a) => !a._id.equals(id));
        return await u.save();
    }

    async updateUserArea(user: { sub: string }, area: Area): Promise<Area> {
        const u = await this.userModel.findById(user.sub);
        const index = u.areas.findIndex((a) => a._id.equals(area._id));
        if (index < 0) throw new NotFoundException('AREA not found');
        u.areas[index] = area;
        u.save();
        return u.areas[index];
    }

    async addOrUpdateAuthorizationWithToken(token: string, authData: AuthorizationDto): Promise<User> {
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            console.error('Error while decoding the token:', error);
            throw new Error('invalid token');
        }

        const userId = decodedToken.sub;
        if (!userId) {
            throw new Error('Missing user ID in token');
        }

        const user = await this.userModel.findById(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const authIndex = user.authorizations.findIndex((auth) => auth.type === authData.type);

        if (authIndex !== -1) {
            user.authorizations[authIndex].data = authData.data;
        } else {
            user.authorizations.push(authData);
        }

        return await user.save();
    }

    async toggleUserArea(user: { sub: string }, id: ObjectId): Promise<Area> {
        const area = await this.getUserArea(user, id);
        area.active = !area.active;
        return await this.updateUserArea(user, area);
    }
}
