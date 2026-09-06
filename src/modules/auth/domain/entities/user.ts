import { Entity, type ConfigEntityProps } from '@/shared/entities/entity';
import type { Email } from '../value-objects/email';

interface UserProps {
  name: string;
  email: Email;
  passwordHash: string;
}

export class User extends Entity<UserProps> {
  get name(): string {
    return this.props.name;
  }

  get email(): Email {
    return this.props.email;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  static create(props: UserProps, configProps?: ConfigEntityProps): User {
    return new User(props, configProps);
  }
}
