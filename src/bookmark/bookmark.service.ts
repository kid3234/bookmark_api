/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Bookmarkdto } from './dto';
import { EditBookmarkDto } from './dto/edit-bookmark.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarkService {
    constructor(private prisma: PrismaService) { }




    async addBookmark(userId: number, dto: Bookmarkdto) {
        const bookmark = await this.prisma.bookmark.create({
            data: {

                userId,
                ...dto,
            }
        })
        return bookmark
    }

    async getBookmarks(userId: number) {
        const bookmarks = await this.prisma.bookmark.findMany({
            where: {
                userId: userId
            }
        })

        return bookmarks

    }
    async getBookmarkById(userId: number, bookmarkId: number) {
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId,
                userId

            }

        })

        if (!bookmark) {
            throw new Error('Bookmark not found');
        }

        return bookmark;

    }
    async editBookmark(userId: number, bookmarkId: number, dto: EditBookmarkDto) {

        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId
            }
        })

        if (!bookmark || bookmark.userId !== userId) {
            throw new ForbiddenException('Access to resource denied');
        }
        return await this.prisma.bookmark.update({
            where: {
                id: bookmarkId
            },
            data: {
                ...dto
            }


        })

    }
    async deleteBookmark(userId: number, bookmarkId: number) {
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId
            }
        })

        if (!bookmark || bookmark.userId !== userId) {
            throw new ForbiddenException('Access to resource denied');
        }

        await this.prisma.bookmark.delete({
            where: {
                id: bookmarkId
            }
        })


    }
}
