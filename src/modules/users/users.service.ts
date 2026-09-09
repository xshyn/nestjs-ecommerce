import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import {
  ArrayOverlap,
  FindOptionsOrderValue,
  FindOptionsWhere,
  ILike,
  In,
  Repository,
} from 'typeorm';
import { UserQueryDto } from './schemas/user-query.schema';
import { Roles } from './types/roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  find(query: UserQueryDto) {
    return this.userRepo.find({
      take: query.limit,
      skip: query.skip,
      order: {
        createdAt: query.sort as FindOptionsOrderValue,
      },
      where: [
        {
          ...(query?.id && { id: query.id }),
          ...(query?.email && { email: query.email }),
          ...(query?.roles && {
            roles: Array.isArray(query.roles)
              ? query.roles
              : query.roles == Roles.ADMIN
                ? ArrayOverlap([query.roles])
                : [query.roles],
          }),
        } as FindOptionsWhere<User>,
        ...((query?.search
          ? [{ email: ILike(`%${query.search}%`) }]
          : []) as FindOptionsWhere<User>[]),
      ],
    });
  }

  findOne(where: FindOptionsWhere<User>, withPassword = false) {
    if (withPassword)
      return this.userRepo
        .createQueryBuilder('users')
        .addSelect('users.password')
        .where(where)
        .getOne();
    return this.userRepo.findOne({ where });
  }

  async create(data: Partial<User>) {
    const user = this.userRepo.create(data);
    const {password , ...rest} = await this.userRepo.save(user);
    return rest
  }
}
