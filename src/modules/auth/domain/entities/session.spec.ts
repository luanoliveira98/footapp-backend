import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/shared/value-objects/unique-entity-id';
import { Session } from './session';
import dayjs from 'dayjs';

describe('Session', () => {
  describe('create', () => {
    it('should create an instance of Session', () => {
      const props = {
        refreshToken: new UniqueEntityId(),
        userId: new UniqueEntityId(),
      };

      const session = Session.create(props);

      expect(session).toBeInstanceOf(Session);
      expect(session.id).toBeInstanceOf(UniqueEntityId);
      expect(session.refreshToken).toEqual(props.refreshToken);
      expect(session.userId.equals(props.userId)).toBe(true);
      expect(dayjs().isBefore(session.expiresAt)).toBe(true);
      expect(session.createdAt).toBeInstanceOf(Date);
      expect(session.updatedAt).toBeInstanceOf(Date);
      expect(session.deletedAt).toBeNull();
    });

    it('should create an instance of Session with a specific configs', () => {
      const configProps = {
        id: new UniqueEntityId(),
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
        deletedAt: new Date('2023-01-03'),
      };

      const session = Session.create(
        {
          refreshToken: new UniqueEntityId(),
          userId: new UniqueEntityId(),
        },
        configProps,
      );

      expect(session).toBeInstanceOf(Session);
      expect(session.id.equals(configProps.id)).toBe(true);
      expect(session.createdAt).toBe(configProps.createdAt);
      expect(session.updatedAt).toBe(configProps.updatedAt);
      expect(session.deletedAt).toBe(configProps.deletedAt);
    });
  });

  describe('restore', () => {
    it('should restore an instance of Session', () => {
      const props = {
        refreshToken: new UniqueEntityId(),
        userId: new UniqueEntityId(),
        expiresAt: faker.date.future(),
      };

      const session = Session.restore(props);

      expect(session).toBeInstanceOf(Session);
      expect(session.id).toBeInstanceOf(UniqueEntityId);
      expect(session.refreshToken).toEqual(props.refreshToken);
      expect(session.expiresAt).toEqual(props.expiresAt);
      expect(session.userId.equals(props.userId)).toBe(true);
      expect(session.createdAt).toBeInstanceOf(Date);
      expect(session.updatedAt).toBeInstanceOf(Date);
      expect(session.deletedAt).toBeNull();
    });

    it('should restore an instance of Session with a specific configs', () => {
      const configProps = {
        id: new UniqueEntityId(),
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
        deletedAt: new Date('2023-01-03'),
      };

      const session = Session.restore(
        {
          refreshToken: new UniqueEntityId(),
          userId: new UniqueEntityId(),
          expiresAt: faker.date.future(),
        },
        configProps,
      );

      expect(session).toBeInstanceOf(Session);
      expect(session.id.equals(configProps.id)).toBe(true);
      expect(session.createdAt).toBe(configProps.createdAt);
      expect(session.updatedAt).toBe(configProps.updatedAt);
      expect(session.deletedAt).toBe(configProps.deletedAt);
    });
  });

  describe('isExpired', () => {
    it('should not be expired session', () => {
      const session = Session.restore({
        refreshToken: new UniqueEntityId(),
        userId: new UniqueEntityId(),
        expiresAt: faker.date.future(),
      });

      expect(session.isExpired).toBe(false);
    });

    it('should be expired session', () => {
      const session = Session.restore({
        refreshToken: new UniqueEntityId(),
        userId: new UniqueEntityId(),
        expiresAt: faker.date.past(),
      });

      expect(session.isExpired).toBe(true);
    });
  });
});
