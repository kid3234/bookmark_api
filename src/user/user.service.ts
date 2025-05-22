/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Edituserdto } from './dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    // Define your user-related business logic here
    // For example, you can create methods for user registration, login, etc.

    // Example method
    // registerUser(userData: any) {
    //   // Logic to register a new user
    // }

    async getUsers() {

        const user = await this.prisma.user.findMany();
        console.log(user);
        return user;

    }

    async getProfile(userId:number){
        const user= await this.prisma.user.findUnique({
            where:{
                id:userId
            }
        })
        if (!user) {
            throw new Error('User not found');
        }
        return user
    }

    async editProfile(userId:number,dto:Edituserdto){
      const user = await this.prisma.user.update({
        where:{
            id:userId,
        },
        data:{
            ...dto,
        }
      })

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {hash, ...responce}= user
      
      return responce;

        
    }
}
