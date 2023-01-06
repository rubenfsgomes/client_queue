import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModule } from './customer.module';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://rubenfsgomes:mongodbpassword@cluster0.ceqilue.mongodb.net/?retryWrites=true&w=majority'),
    CustomerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
