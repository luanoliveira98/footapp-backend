import { UniqueEntityId } from '../value-objects/unique-entity-id';
import { Entity } from './entity';
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

  static create(props: TestProps, id?: UniqueEntityId): TestEntity {
    return new TestEntity(props, id);
  }
}

describe('Entity', () => {
  it('should create a new entity with a unique ID', () => {
    const props = {
      name: faker.person.firstName(),
      age: faker.number.int({ min: 0, max: 120 }),
    };

    const entity = TestEntity.create(props);

    expect(entity).toBeDefined();
    expect(entity.id).toBeDefined();
    expect(entity.name).toEqual(props.name);
    expect(entity.age).toEqual(props.age);
  });

  it('should create a new entity with a provided ID', () => {
    const props = {
      name: faker.person.firstName(),
      age: faker.number.int({ min: 0, max: 120 }),
    };

    const id = new UniqueEntityId();
    const entity = TestEntity.create(props, id);

    expect(entity).toBeDefined();
    expect(entity.id).toEqual(id);
    expect(entity.name).toEqual(props.name);
    expect(entity.age).toEqual(props.age);
  });

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
    const entity1 = TestEntity.create(props, id);
    const entity2 = TestEntity.create(props, id);

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
