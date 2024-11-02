import {
  User,
  UserRegistrationDto,
  TokenDto,
  AuthorizationDto,
  AuthorizationsTypes,
} from "@area/shared";
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { AuthentifiedUser } from "../auth/auth.guard";
import { ServicesService } from "../services/services.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly servicesService: ServicesService,
  ) {}

  async createUser(dto: UserRegistrationDto): Promise<User> {
    dto.password = await bcrypt.hash(dto.password, 10);
    const user = new this.userModel(dto);
    return await user.save();
  }

  async findById(id: string): Promise<User> {
    return await this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email: email }).exec();
  }

  async deleteUser(_user: AuthentifiedUser): Promise<void> {
    const user = await this.userModel.findByIdAndDelete(_user.id).exec();
    if (!user) throw new UnauthorizedException();
  }

  //TODO: rename with google
  async findOrCreateUser(userData: {
    email: string;
    first_name: string;
    last_name: string;
    token: TokenDto;
  }): Promise<User> {
    const user = await this.userModel.findOne({ email: userData.email });
    if (user) {
      const authIndex = user.authorizations.findIndex(
        (auth) => auth.type === AuthorizationsTypes.GOOGLE,
      );
      if (authIndex !== -1) {
        user.authorizations[authIndex].data = userData.token;
      } else {
        user.authorizations.push({
          type: AuthorizationsTypes.GOOGLE,
          data: userData.token,
        } as AuthorizationDto);
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

  async getUserAuthorizations(_user: AuthentifiedUser): Promise<string[]> {
    const user: User = await this.userModel.findById(_user.id).exec();
    if (!user) throw new UnauthorizedException("Invalid user");
    return user.authorizations.map((auth) => auth.type);
  }

  async addOrUpdateAuthorizationWithToken(
    token: string,
    authData: AuthorizationDto,
  ): Promise<User> {
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error("Error while decoding the token:", error);
      throw new Error("invalid token");
    }

    const userId = decodedToken.sub;
    if (!userId) {
      throw new Error("Missing user ID in token");
    }

    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const authIndex = user.authorizations.findIndex(
      (auth) => auth.type === authData.type,
    );

    if (authIndex !== -1) {
      user.authorizations[authIndex].data = authData.data;
    } else {
      user.authorizations.push(authData);
    }

    return await user.save();
  }

  async removeAuthorization(
    _user: AuthentifiedUser,
    authType: AuthorizationsTypes,
  ): Promise<void> {
    const user = await this.userModel.findById(_user.id).exec();
    if (!user) throw new UnauthorizedException();
    user.authorizations = user.authorizations.filter(
      (auth) => auth.type != authType,
    );
    const bannedTypes =
      await this.servicesService.getAreaTypesFromAuthType(authType);
    user.areas = user.areas.filter(
      (area) =>
        !bannedTypes.actionTypes.includes(area.action.informations.type) &&
        !bannedTypes.reactionTypes.includes(area.reaction.informations.type),
    );
    user.save();
  }
}
