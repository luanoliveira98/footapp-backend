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

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((user) => user.id.toString() === id);
    return Promise.resolve(user || null);
  }

  async save(user: User): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(user.id));
    if (index !== -1) {
      this.items[index] = user;
    }
    return Promise.resolve(void 0);
  }

  async list(): Promise<User[]> {
    return Promise.resolve(this.items);
  }
}
