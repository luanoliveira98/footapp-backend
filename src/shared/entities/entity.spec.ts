import { UniqueEntityId } from '../value-objects/unique-entity-id';
import { Entity, type EntityProps } from './entity';
import { faker } from '@faker-js/faker';

interface TestProps {
  name: string;
  age: number;
}

class TestEntity extends Entity<TestProps> {
  get name(): string {
    return this.props.name;
  }

  get age(): number {
    return this.props.age;
  }

  static create(props: TestProps, configProps?: EntityProps): TestEntity {
    return new TestEntity(props, configProps);
  }
}

describe('Entity', () => {
  describe('constructor', () => {
    it('should create a new entity without sending config props', () => {
      const props = {
        name: faker.person.firstName(),
        age: faker.number.int({ min: 0, max: 120 }),
      };

      const entity = TestEntity.create(props);

      expect(entity).toBeDefined();
      expect(entity.id).toBeInstanceOf(UniqueEntityId);
      expect(entity.name).toEqual(props.name);
      expect(entity.createdAt).toBeInstanceOf(Date);
      expect(entity.updatedAt).toBeInstanceOf(Date);
      expect(entity.deletedAt).toBeNull();
    });

    it('should create a new entity sending config props', () => {
      const props = {
        name: faker.person.firstName(),
        age: faker.number.int({ min: 0, max: 120 }),
      };

      const configProsp = {
        id: new UniqueEntityId(),
        createdAt: new Date('2023-01-01T00:00:00Z'),
        updatedAt: new Date('2023-01-01T00:00:00Z'),
        deletedAt: null,
      };
      const entity = TestEntity.create(props, configProsp);

      expect(entity).toBeDefined();
      expect(entity.id).toEqual(configProsp.id);
      expect(entity.name).toEqual(props.name);
      expect(entity.age).toEqual(props.age);
      expect(entity.createdAt).toEqual(configProsp.createdAt);
      expect(entity.updatedAt).toEqual(configProsp.updatedAt);
      expect(entity.deletedAt).toEqual(configProsp.deletedAt);
    });
  });

  describe('equals', () => {
    it('should return false when comparing an entity with null', () => {
      const props = {
        name: faker.person.firstName(),
        age: faker.number.int({ min: 0, max: 120 }),
      };

      const entity = TestEntity.create(props);

      expect(entity.equals(null as any)).toBe(false);
    });

    it('should return false when comparing an entity with a different type', () => {
      const props = {
        name: faker.person.firstName(),
        age: faker.number.int({ min: 0, max: 120 }),
      };

      const entity = TestEntity.create(props);

      expect(entity.equals({} as any)).toBe(false);
    });

    it('should return true when comparing an entity with itself', () => {
      const props = {
        name: faker.person.firstName(),
        age: faker.number.int({ min: 0, max: 120 }),
      };

      const entity = TestEntity.create(props);

      expect(entity.equals(entity)).toBe(true);
    });

    it('should return true when comparing two entities with the same ID', () => {
      const props = {
        name: faker.person.firstName(),
        age: faker.number.int({ min: 0, max: 120 }),
      };

      const id = new UniqueEntityId();
      const entity1 = TestEntity.create(props, { id });
      const entity2 = TestEntity.create(props, { id });

      expect(entity1.equals(entity2)).toBe(true);
    });

    it('should return false when comparing two entities with different IDs', () => {
      const props1 = {
        name: faker.person.firstName(),
        age: faker.number.int({ min: 0, max: 120 }),
      };

      const props2 = {
        name: faker.person.firstName(),
        age: faker.number.int({ min: 0, max: 120 }),
      };

      const entity1 = TestEntity.create(props1);
      const entity2 = TestEntity.create(props2);

      expect(entity1.equals(entity2)).toBe(false);
    });
  });

  describe('touch', () => {
    it('should update the updatedAt property when touch is called', () => {
      const props = {
        name: faker.person.firstName(),
        age: faker.number.int({ min: 0, max: 120 }),
      };

      const entity = TestEntity.create(props, {
        updatedAt: new Date('2023-01-01T00:00:00Z'),
      });
      const oldUpdatedAt = entity.updatedAt;

      entity['touch']();

      expect(entity.updatedAt).not.toEqual(oldUpdatedAt);
    });
  });

  describe('delete', () => {
    it('should set the deletedAt property when delete is called', () => {
      const props = {
        name: faker.person.firstName(),
        age: faker.number.int({ min: 0, max: 120 }),
      };

      const entity = TestEntity.create(props);

      expect(entity.deletedAt).toBeNull();

      entity['delete']();

      expect(entity.deletedAt).toBeInstanceOf(Date);
    });
  });
});
