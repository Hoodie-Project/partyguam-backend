import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { CustomErrorExceptionFilter } from './common/exception/error.filter';
import * as fs from 'fs';
import * as session from 'express-session';

import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';

declare module 'express-session' {
  interface SessionData {
    email: string;
  }
}

async function bootstrap() {
  const httpsOptions =
    process.env.MODE_ENV === 'local'
      ? null
      : {
          ca: fs.readFileSync(process.env.CA_REPO),
          key: fs.readFileSync(process.env.KEY_REPO),
          cert: fs.readFileSync(process.env.CERT_REPO),
        };
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });

  app.enableCors({
    methods: 'GET,PUT,PATCH,POST,DELETE',
    origin: '*', //우선 모두 허용
    credentials: true,
  });
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  app.use(
    session({
      secret: process.env.SESSION_SECRET, //세션아이디
      resave: false, //세션이 수정되지 않아도 지속적으로 저장하게 하는 옵션
      saveUninitialized: false, //초기화되지 않는 세션을 저장하게 함
      cookie: {
        // secure: true, // HTTPS 연결에서만 쿠키 전송
        httpOnly: true, // JavaScript에서 쿠키 접근 불가능
        sameSite: 'strict', // CSRF 공격 방지
      },
    }),
  );

  // app.use(passport.initialize());
  // app.use(passport.session());
  // app.use(cookieParser()); // cookie 사용

  //docs
  const config = new DocumentBuilder()
    .setTitle('party-guam API')
    .setDescription('base URL - /api')
    .setVersion('1.0')
    .addTag('party-guam')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.setGlobalPrefix('api'); // 전체 endpoint
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new CustomErrorExceptionFilter());

  await app.listen(process.env.PORT);
  console.log(`listening on port ${process.env.PORT}`);
}
bootstrap();
