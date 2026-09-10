import { Entity, type ConfigEntityProps } from '@/shared/entities/entity';
import type { UniqueEntityId } from '@/shared/value-objects/unique-entity-id';
import dayjs from 'dayjs';

export interface SessionProps {
  refreshToken: UniqueEntityId;
  userId: UniqueEntityId;
  expiresAt: Date;
}

export class Session extends Entity<SessionProps> {
  get refreshToken() {
    return this.props.refreshToken;
  }

  get userId() {
    return this.props.userId;
  }

  get expiresAt() {
    return this.props.expiresAt;
  }

  static create(
    props: Omit<SessionProps, 'expiresAt'>,
    configProps?: ConfigEntityProps,
  ): Session {
    const expiresAt = dayjs().add(7, 'days').toDate();
    return new Session(
      {
        ...props,
        expiresAt,
      },
      configProps,
    );
  }

  static restore(
    props: SessionProps,
    configProps?: ConfigEntityProps,
  ): Session {
    return new Session(props, configProps);
  }

  get isExpired(): boolean {
    return dayjs().isAfter(dayjs(this.props.expiresAt));
  }
}
