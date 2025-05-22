/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */


import { ForbiddenException, Injectable } from "@nestjs/common";
import { AuthDto } from "./dto";
import * as argon from "argon2"
// import { PrismaService } from "src/prisma/prisma.service";
// import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from "../../generated/prisma/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import  {PrismaService}  from "../prisma/prisma.service";


@Injectable()

export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private readonly config: ConfigService) { }
    async signup(dto: AuthDto) {
        const hashpass = await argon.hash(dto.password)

        try {

            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash: hashpass
                }
            }

            )



            return this.signToken(user.id, user.email);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new ForbiddenException("Credentials taken")
                }
            }
            throw error;
        }

    }
    async signin(dto: AuthDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        });
        if (!user) {
            throw new ForbiddenException("User not found!");
        }
        const passwordMatchs = await argon.verify(user.hash, dto.password);

        if (!passwordMatchs) {
            throw new ForbiddenException("Password not match!");
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { hash, ...responcedata } = user;

        return this.signToken(user.id, user.email);
        // return { msg: "I have signed in" }
    }

    async signToken(userId: number, email: string): Promise<{ access_token: string }> {
        const data = {
            sub: userId,
            email
        };
        const token = await this.jwt.signAsync(data, {
            expiresIn: "1d",
            secret: this.config.get("JWT_SECRET")
        });

        return {
            access_token: token,
        };
    }
}