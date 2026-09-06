import { InvalidEmailError } from '../errors/invalid-email-error';
import { Email } from './email';

describe('Email', () => {
  describe('constructor', () => {
    it('should create an instance of Email', () => {
      const email = new Email('test@example.com');

      expect(email).toBeInstanceOf(Email);
      expect(email.toString()).toBe('test@example.com');
    });

    it('should throw an error when creating an Email with an invalid value', () => {
      expect(() => new Email('invalid-email')).toThrow(InvalidEmailError);
    });
  });

  describe('equals', () => {
    it('should return false when comparing with null', () => {
      const email = new Email('test@example.com');

      expect(email.equals(null as any)).toBe(false);
    });

    it('should return false when comparing with a different type', () => {
      const email = new Email('test@example.com');

      expect(email.equals({} as any)).toBe(false);
    });

    it('should return true when comparing with the same email', () => {
      const email1 = new Email('test@example.com');
      const email2 = new Email('test@example.com');

      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false when comparing with a different email', () => {
      const email1 = new Email('test@example.com');
      const email2 = new Email('other@example.com');

      expect(email1.equals(email2)).toBe(false);
    });
  });
});
