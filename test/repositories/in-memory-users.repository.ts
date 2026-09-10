import type { User } from '@/modules/auth/domain/entities/user';
import type { UsersRepository } from '@/modules/auth/domain/repositories/users.repository';

export class InMemoryUsersRepository implements UsersRepository {
  private items: User[] = [];

  async create(user: User): Promise<void> {
    this.items.push(user);
    return Promise.resolve(void 0);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((user) => user.email.toString() === email);
    return Promise.resolve(user || null);
  }
}
