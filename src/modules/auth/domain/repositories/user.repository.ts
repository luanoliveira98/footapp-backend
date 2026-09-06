import type { UniqueEntityId } from '@/shared/value-objects/unique-entity-id';
import type { User } from '../entities/user';
import type { Email } from '../value-objects/email';

export interface UserRepository {
  create(user: User): Promise<void>;
  findByEmail(email: Email): Promise<User | null>;
  findById(id: UniqueEntityId): Promise<User | null>;
  save(user: User): Promise<void>;
  list(): Promise<User[]>;
}
