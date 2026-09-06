import { InvalidEmailError } from '../errors/invalid-email-error';

export class Email {
  private readonly value: string;

  constructor(value: string) {
    if (!Email.validate(value)) throw new InvalidEmailError(value);

    this.value = value;
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
