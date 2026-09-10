import type { Session } from '@/modules/auth/domain/entities/session';
import type { SessionsRepository } from '@/modules/auth/domain/repositories/sessions.repository';
import { UniqueEntityId } from '@/shared/value-objects/unique-entity-id';

export class InMemorySessionsRepository implements SessionsRepository {
  private items: Session[] = [];

  async create(session: Session): Promise<void> {
    this.items.push(session);
    return Promise.resolve(void 0);
  }

  async findByUserId(userId: string): Promise<Session[]> {
    return Promise.resolve(
      this.items.filter((session) =>
        session.userId.equals(new UniqueEntityId(userId)),
      ),
    );
  }

  async list(): Promise<Session[]> {
    return Promise.resolve(this.items);
  }
}
