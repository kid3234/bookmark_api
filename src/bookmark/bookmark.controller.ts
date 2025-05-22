/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { Bookmarkdto } from './dto';
import { GetUser } from '../auth/decorator';
import { EditBookmarkDto } from './dto/edit-bookmark.dto';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(
    private bookmark: BookmarkService,
  ) {}

  @Post()
  addBookmark(
    @GetUser() user: { userId: number },
    @Body() dto: Bookmarkdto,
  ) {
    console.log("data to create ",{
        userId: user.userId,
        dto,
    });
    
    return this.bookmark.addBookmark(
      user.userId,
      dto,
    );
  }

  @Get()
  getBookmarks(
    @GetUser() user: { userId: number },
  ) {
    return this.bookmark.getBookmarks(
      user.userId,
    );
  }
  @Get(':id')
  getBookmarkById(
    @GetUser() user: { userId: number },
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmark.getBookmarkById(
      user.userId,
      bookmarkId,
    );
  }
  @Patch(':id')
  editBookmark(
    @GetUser() user: { userId: number },
    @Body() dto: EditBookmarkDto,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmark.editBookmark(
      user.userId,
      bookmarkId,
      dto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteBookmark(
    @GetUser() user: { userId: number },
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmark.deleteBookmark(
      user.userId,
      bookmarkId,
    );
  }
}
