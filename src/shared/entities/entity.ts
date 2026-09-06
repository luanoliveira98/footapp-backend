import { UniqueEntityId } from '../value-objects/unique-entity-id';

export interface ConfigEntityProps {
  id?: UniqueEntityId;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class Entity<Props> {
  private readonly _id: UniqueEntityId;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt: Date | null;

  protected props: Props;

  get id(): UniqueEntityId {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }

  protected constructor(props: Props, configProps?: ConfigEntityProps) {
    this._id = configProps?.id ?? new UniqueEntityId();
    this._createdAt = configProps?.createdAt ?? new Date();
    this._updatedAt = configProps?.updatedAt ?? new Date();
    this._deletedAt = configProps?.deletedAt ?? null;
    this.props = props;
  }

  public equals(entity: Entity<Props>): boolean {
    if (!entity) return false;

    if (!(entity instanceof Entity)) return false;

    if (this === entity) return true;

    return this.id.equals(entity.id);
  }

  protected touch(): void {
    this._updatedAt = new Date();
  }

  protected delete(): void {
    this._deletedAt = new Date();
  }
}
