/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(private readonly config:ConfigService){
        super({
            datasources:{
                db:{
                    url:config.get('DATABASE_URL')
                }
            }
        })

        
        
    }
}
