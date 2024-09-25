import { Injectable,UnauthorizedException } from '@nestjs/common';
import { Db, InsertOneResult, MongoClient, ObjectId } from 'mongodb';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private db: Db;

  constructor(private readonly jwtService: JwtService) {
    const base_db_uri = process.env.DB_URI || '';
    const client = new MongoClient(base_db_uri);

    client.connect().then(() => {
      this.db = client.db('area');
    });
  }

  private async generateJwt(user: any) {
    const payload = { email: user.email, sub: user._id };
    return this.jwtService.sign(payload);
  }


  async login(email: string, password: string) {
    const user = await this.db.collection('users').findOne({ email });

    if (!user) {
        throw new UnauthorizedException('Incorrect email');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new UnauthorizedException('Incorrect password');
    }

    const token = await this.generateJwt(user);
  
    return {
        message: 'connection successful',
        token,
        user: {
            id: user._id,
            email: user.email,
        }
    };

  }

  async register(email: string, password: string) {
    const usersCollection = await this.db.collection('users');
    const users = await this.db.collection('users').findOne({ email });

    if (users) {
      throw new UnauthorizedException('Email already used');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      email,
      password: hashedPassword
      //TODO: update with new database schema
    }

    const token = await this.generateJwt(user);

    const result = await usersCollection.insertOne(user)

    return {
      message: 'Registration successful',
      token,
      user: {
        id: result.insertedId,
        email: user.email
      }
    };
  }
}
