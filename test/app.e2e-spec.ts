import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as querystring from 'querystring'; 

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(async () => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {}); // Memantau pemanggilan console.log

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore(); // Mengembalikan fungsi console.log ke keadaan semula setelah pengujian
  });

  afterAll(async () => {
    await app.close(); // Menutup aplikasi setelah pengujian selesai
  });

  it('/users (GET) without query', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect((response) => {
        expect(response.body.code).toBe('200');
        expect(response.body.desc).toBe('success');
        expect(response.body.data).toBeDefined();
        expect(Array.isArray(response.body.data)).toBe(true);
        // Jika Anda ingin menguji data pengguna tertentu dalam respons
        expect(response.body.data[0][1].name).toBe('Ricky Firmansyah');
        // Tambahkan pengujian lain sesuai kebutuhan
      });
  });

  it('/books (GET) without query', () => {
    return request(app.getHttpServer())
      .get('/books')
      .expect(200)
      .expect((response) => {
        expect(response.body.code).toBe('200');
        expect(response.body.desc).toBe('success');
        expect(response.body.data).toBeDefined();
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data[0][0].author).toBe('Ricky Firmansyah');
        // Tambahkan pengujian lain sesuai kebutuhan
      });
  });

  // Test dengan query params untuk /users
  it('/users (GET) with query params', async () => {
    const query = {
      onYear: '20,23',
      name: 'Ricky',
      email: 'Ricky,Aeth',
      filter: 'eyJhZ2UiOiAyM30=',
    };

    // Menggunakan querystring untuk memformat parameter query string
    const queryStringFormatted = querystring.stringify(query);

    const response = await request(app.getHttpServer())
      .get(`/users?${queryStringFormatted}`)
      .expect(200);

    expect(response.body.code).toBe('200');
    expect(response.body.desc).toBe('success');
    expect(response.body.data).toBeDefined();
    expect(Array.isArray(response.body.data)).toBe(true);
    // Tambahkan pengujian lain sesuai kebutuhan
  });

  // Test dengan query params untuk /books
  it('/books (GET) with query params', async () => {
    const query = {
      onYear: '2019,2023',
      title: 'Myth of,Ragnarok',
      author: 'Ricky,Aeth',
    };

    // Menggunakan querystring untuk memformat parameter query string
    const queryStringFormatted = querystring.stringify(query);

    const response = await request(app.getHttpServer())
      .get(`/books?${queryStringFormatted}`)
      .expect(200);

    expect(response.body.code).toBe('200');
    expect(response.body.desc).toBe('success');
    expect(response.body.data).toBeDefined();
    expect(Array.isArray(response.body.data)).toBe(true);
    // Tambahkan pengujian lain sesuai kebutuhan
  });
});
