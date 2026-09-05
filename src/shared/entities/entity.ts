import { UniqueEntityId } from '../value-objects/unique-entity-id';

export class Entity<Props> {
  private readonly _id: UniqueEntityId;
  protected props: Props;

  get id(): UniqueEntityId {
    return this._id;
  }

  constructor(props: Props, id?: UniqueEntityId) {
    this._id = id ?? new UniqueEntityId();
    this.props = props;
  }

  public equals(entity: Entity<Props>): boolean {
    if (!entity) return false;

    if (!(entity instanceof Entity)) return false;

    if (this === entity) return true;

    return this.id.equals(entity.id);
  }
}
