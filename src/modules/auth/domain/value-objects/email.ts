import { left, right, type Either } from '@/shared/utils/either';
import { InvalidEmailError } from '../errors/invalid-email.error';

export class Email {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Either<InvalidEmailError, Email> {
    if (!Email.validate(value)) return left(new InvalidEmailError());
    const email = new Email(value);
    return right(email);
  }

  private static validate(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  toString(): string {
    return this.value;
  }

  equals(email: Email): boolean {
    if (!email) return false;

    if (!(email instanceof Email)) return false;

    return email.toString() === this.value;
  }
}
