type Extension = {
  Expr: any;
  Between: any;
  BinaryApp: any;
  Case: any;
  Cast: any;
  Collate: any;
  Exists: any;
  Extract: any;
  FunctionApp: any;
  IsNull: any;
  InList: any;
  InSubQuery: any;
  SubQuery: any;
  UnaryApp: any;
  Query: any;
  Select: any;
  Table: any;
  Insert: any;
  Update: any;
  UpdatePositioned: any;
  Delete: any;
  DeletePositioned: any;
  SchemaDefinition: any;
  DomainDefinition: any;
  TableDefinition: any;
  ColumnDefinition: any;
  UniqueConstraint: any;
  ConstraintDefinition: any;
  ReferenceConstraint: any;
  ConstraintCheckTime: any;
  ViewDefinition: any;
  GrantStatement: any;
  DropSchema: any;
  DropTable: any;
  DropView: any;
  RevokePrivilege: any;
  DropDomain: any;
  DropAssertion: any;
  AlterDomain: any;
  AlterTable: any;
  AlterTableAction: any;
  AlterColumn: any;
  SetDefault: any;
  DropDefault: any;
  DropBehavior: any;
  DropColumn: any;
  AddTableConstraint: any;
  DropTableConstraint: any;
  DomainAction: any;
  AddDomainConstraint: any;
  DropDomainConstraint: any;
};

type NoExtension = {
  Expr: unknown;
  Between: unknown;
  BinaryApp: unknown;
  Case: unknown;
  Cast: unknown;
  Collate: unknown;
  Exists: unknown;
  Extract: unknown;
  FunctionApp: unknown;
  IsNull: unknown;
  InList: unknown;
  InSubQuery: unknown;
  SubQuery: unknown;
  UnaryApp: unknown;
  Query: unknown;
  Select: unknown;
  Table: unknown;
  Insert: unknown;
  Update: unknown;
  UpdatePositioned: unknown;
  Delete: unknown;
  DeletePositioned: unknown;
  SchemaDefinition: unknown;
  DomainDefinition: unknown;
  TableDefinition: unknown;
  ColumnDefinition: unknown;
  UniqueConstraint: unknown;
  ConstraintDefinition: unknown;
  ReferenceConstraint: unknown;
  ConstraintCheckTime: unknown;
  ViewDefinition: unknown;
  GrantStatement: unknown;
  DropSchema: unknown;
  DropTable: unknown;
  DropView: unknown;
  RevokePrivilege: unknown;
  DropDomain: unknown;
  DropAssertion: unknown;
  AlterDomain: unknown;
  AlterTable: unknown;
  AlterTableAction: unknown;
  AlterColumn: unknown;
  SetDefault: unknown;
  DropDefault: unknown;
  DropBehavior: unknown;
  DropColumn: unknown;
  AddTableConstraint: unknown;
  DropTableConstraint: unknown;
  DomainAction: never;
  AddDomainConstraint: unknown;
  DropDomainConstraint: unknown;
};

const copy = <T extends {}>(obj: T, vals: Partial<T>): T => ({ ...obj, ...vals });

export { Extension, NoExtension, copy };
