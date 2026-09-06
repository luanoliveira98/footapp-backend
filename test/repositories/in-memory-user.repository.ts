import type { User } from '@/modules/auth/domain/entities/user';
import type { UserRepository } from '@/modules/auth/domain/repositories/user.repository';
import type { Email } from '@/modules/auth/domain/value-objects/email';
import type { UniqueEntityId } from '@/shared/value-objects/unique-entity-id';

export class InMemoryUserRepository implements UserRepository {
  private items: User[] = [];

  async create(user: User): Promise<void> {
    this.items.push(user);
    return Promise.resolve(void 0);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const user = this.items.find((user) => user.email.equals(email));
    return Promise.resolve(user || null);
  }

  async findById(id: UniqueEntityId): Promise<User | null> {
    const user = this.items.find((user) => user.id.equals(id));
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
