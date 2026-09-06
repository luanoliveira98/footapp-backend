import { InvalidEmailError } from '../errors/invalid-email.error';
import { Email } from './email';

describe('Email', () => {
  describe('constructor', () => {
    it('should create an instance of Email', () => {
      const response = Email.create('test@example.com');

      expect(response.isRight()).toBe(true);
      expect(response.value).toBeInstanceOf(Email);
      expect(response.value.toString()).toBe('test@example.com');
    });

    it('should throw an error when creating an Email with an invalid value', () => {
      const response = Email.create('invalid-email');

      expect(response.isLeft()).toBe(true);
      expect(response.value).toBeInstanceOf(InvalidEmailError);
    });
  });

  describe('equals', () => {
    it('should return false when comparing with null', () => {
      const response = Email.create('test@example.com');

      if (response.isLeft()) throw new Error('Should be right');
      expect(response.value.equals(null as any)).toBe(false);
    });

    it('should return false when comparing with a different type', () => {
      const response = Email.create('test@example.com');

      if (response.isLeft()) throw new Error('Should be right');
      expect(response.value.equals({} as any)).toBe(false);
    });

    it('should return true when comparing with the same email', () => {
      const response1 = Email.create('test@example.com');
      const response2 = Email.create('test@example.com');

      if (response1.isLeft()) throw new Error('Should be right');
      if (response2.isLeft()) throw new Error('Should be right');

      expect(response1.value.equals(response2.value)).toBe(true);
    });

    it('should return false when comparing with a different email', () => {
      const response1 = Email.create('test@example.com');
      const response2 = Email.create('other@example.com');

      if (response1.isLeft()) throw new Error('Should be right');
      if (response2.isLeft()) throw new Error('Should be right');

      expect(response1.value.equals(response2.value)).toBe(false);
    });
  });
});
