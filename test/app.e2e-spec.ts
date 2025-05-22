/* eslint-disable prettier/prettier */
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { Edituserdto } from 'src/user/dto';
import { Bookmarkdto, EditBookmarkDto } from 'src/bookmark/dto';



describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const moduleRef =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);
    prisma = app.get(PrismaService);

    await prisma.cleanDb();
    pactum.request.setBaseUrl(
      'http://localhost:3333',
    );
  });

  afterAll(async () => {

    await app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'kid@gmail.com',
      password: '1234',
    };


    describe('Signup', () => {
      it('should throw if email not found', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password
          })
          .expectStatus(400);
      });

      it('should throw if password not found', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email
          })
          .expectStatus(400);
      });

      it('should throw if body not found', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(400);
      });

      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });
    describe('Signin', () => {
      it('should throw if email not found', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password
          })
          .expectStatus(400);
      });

      it('should throw if password not found', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email
          })
          .expectStatus(400);
      });

      it('should throw if body not found', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .expectStatus(400);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    const dto: Edituserdto = {
      email: "kid2@gmail.com",
      firstName: "kidus"
    }
    describe('Get profile', () => {
      it('should get current user', () => {
        return pactum.spec().get('/users/profile').withHeaders({
          Authorization: 'Bearer $S{userAt}'
        }).expectStatus(200);
      })
    });
    describe('Edit user', () => {
      it('should edit profile', () => {
        return pactum.spec().patch('/users/profile').withBody(dto).withHeaders({
          Authorization: 'Bearer $S{userAt}'
        }).expectStatus(200).expectBodyContains(dto.firstName).expectBodyContains(dto.email);
      })
    });
  });

  describe('Bookmark', () => {
    const dto: Bookmarkdto = {
      title: "test",
      link: "https://www.google.com"
    };

    const editdto: EditBookmarkDto = {
      title: "test2",
      description: "test2",
    };
    describe('Get all bookmarks', () => {
      it('should get all bookmarks', () => {
        return pactum.spec().get('/bookmarks').withHeaders({
          Authorization: 'Bearer $S{userAt}'
        }).expectStatus(200);

      });
    });
    describe('Create bookmark', () => {
      it('should create bookmark', () => {
        return pactum.spec().post('/bookmarks').withBody(dto).withHeaders({
          Authorization: 'Bearer $S{userAt}'
        }).expectStatus(201).stores('bookmarkId', 'id');
      });
    });




    describe('Get bookmark by id', () => {
      it('should get bookmark by id', () => {
        return pactum.spec().get('/bookmarks/{id}').withPathParams('id', '$S{bookmarkId}').withHeaders({
          Authorization: 'Bearer $S{userAt}'
        }).expectStatus(200).inspect();
      });
    });

    describe('Edit bookmark by id', () => {
      it('should edit bookmark by id', () => {
        return pactum.spec().patch('/bookmarks/{id}').withPathParams('id', '$S{bookmarkId}').withBody(editdto).withHeaders({
          Authorization: 'Bearer $S{userAt}'
        }).expectStatus(200).expectBodyContains(editdto.title).expectBodyContains(editdto.description);
      });
    });
    describe('Delete bookmark by id', () => {
      it('should delete bookmark by id', () => {
        return pactum.spec().delete('/bookmarks/{id}').withPathParams('id', '$S{bookmarkId}').withHeaders({
          Authorization: 'Bearer $S{userAt}'
        }).expectStatus(204);
      });
    })

  });

})

