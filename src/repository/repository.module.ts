import { Module } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { TodosService } from './todos/todos.service';

@Module({
  providers: [UsersService, TodosService],
  exports: [UsersService, TodosService],
})
export class RepositoryModule {}
