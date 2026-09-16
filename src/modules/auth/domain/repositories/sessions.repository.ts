import type { Session } from '../entities/session';

export interface SessionRepositoryDeleteRequest {
  refreshToken: string;
  userId: string;
}

export abstract class SessionsRepository {
  abstract create(session: Session): Promise<void>;
  abstract delete(data: SessionRepositoryDeleteRequest): Promise<void>;
}
