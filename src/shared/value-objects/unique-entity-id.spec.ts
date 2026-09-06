import { UniqueEntityId } from './unique-entity-id';

describe('UniqueEntityId', () => {
  describe('constructor', () => {
    it('should create a new UniqueEntityId when no id is provided', () => {
      const uniqueEntityId = new UniqueEntityId();

      expect(uniqueEntityId).toBeDefined();
      expect(uniqueEntityId.toString()).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
    });

    it('should create a new UniqueEntityId with the provided id', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const uniqueEntityId = new UniqueEntityId(id);

      expect(uniqueEntityId).toBeDefined();
      expect(uniqueEntityId.toString()).toBe(id);
    });
  });

  describe('equals', () => {
    it('should return true when comparing two UniqueEntityIds with the same value', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const uniqueEntityId1 = new UniqueEntityId(id);
      const uniqueEntityId2 = new UniqueEntityId(id);

      expect(uniqueEntityId1.equals(uniqueEntityId2)).toBe(true);
    });

    it('should return false when comparing two UniqueEntityIds with different values', () => {
      const uniqueEntityId1 = new UniqueEntityId();
      const uniqueEntityId2 = new UniqueEntityId();

      expect(uniqueEntityId1.equals(uniqueEntityId2)).toBe(false);
    });

    it('should return false when comparing a UniqueEntityId with null or undefined', () => {
      const uniqueEntityId = new UniqueEntityId();

      expect(uniqueEntityId.equals(null as any)).toBe(false);
      expect(uniqueEntityId.equals(undefined as any)).toBe(false);
    });
  });
});
