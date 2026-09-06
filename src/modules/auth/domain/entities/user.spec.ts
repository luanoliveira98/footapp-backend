import { faker } from '@faker-js/faker';
import { Email } from '../value-objects/email';
import { UniqueEntityId } from '@/shared/value-objects/unique-entity-id';
import { User } from './user';

describe('User', () => {
  describe('create', () => {
    it('should create an instance of User', () => {
      const props = {
        name: faker.person.firstName(),
        email: new Email(faker.internet.email()),
        passwordHash: faker.internet.password(),
      };

      const user = User.create(props);

      expect(user).toBeInstanceOf(User);
      expect(user.id).toBeInstanceOf(UniqueEntityId);
      expect(user.name).toEqual(props.name);
      expect(user.email.equals(props.email)).toBe(true);
      expect(user.passwordHash).toEqual(props.passwordHash);
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
      expect(user.deletedAt).toBeNull();
    });

    it('should create an instance of User with a specific configs', () => {
      const configProps = {
        id: new UniqueEntityId(),
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
        deletedAt: new Date('2023-01-03'),
      };

      const user = User.create(
        {
          name: faker.person.firstName(),
          email: new Email(faker.internet.email()),
          passwordHash: faker.internet.password(),
        },
        configProps,
      );

      expect(user).toBeInstanceOf(User);
      expect(user.id.equals(configProps.id)).toBe(true);
      expect(user.createdAt).toBe(configProps.createdAt);
      expect(user.updatedAt).toBe(configProps.updatedAt);
      expect(user.deletedAt).toBe(configProps.deletedAt);
    });
  });
});
