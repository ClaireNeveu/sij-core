import { Tagged, UnTag, tag, Extension, NoExtension } from './util';
import { Ident, Expr } from './expr';

interface Query<Ext extends Extension = NoExtension> extends Tagged<'Query', {
    readonly commonTableExprs: Array<CommonTableExpr<Ext>>,
    readonly selection: Select<Ext>,
    readonly unions: Array<SetOp<Ext>>,
    readonly ordering: Array<OrderingExpr<Ext>>,
    readonly limit: Expr<Ext> | null,
    readonly offset: Expr<Ext> | null,
    readonly extensions: Ext['query'] | null,
}> {};
const Query = <Ext extends Extension = NoExtension>(args: UnTag<Query<Ext>>): Query<Ext> => tag('Query', args);

/**
 * A single Common Table Expression as part of a WITH statement.
 * `tableAlias [(col1, col2, ...)] AS (query)`
 */
type CommonTableExpr<Ext extends Extension = NoExtension> = Tagged<'CommonTableExpr', {
    readonly alias: TableAlias,
    readonly query: Query<Ext>
}>;
const CommonTableExpr = <Ext extends Extension = NoExtension>(
    args: UnTag<CommonTableExpr<Ext>>
): CommonTableExpr<Ext> => tag('CommonTableExpr', args);


/**
 * Alias name for a table and optionally its columns
 * e.g. aliasedName (colAlias1, colAlias2) AS 
 */
type TableAlias<Ext extends Extension = NoExtension> = Tagged<'TableAlias', {
    readonly name: Ident,
    readonly columns: Array<Ident>
}>;
const TableAlias = (args: UnTag<TableAlias>): TableAlias => tag('TableAlias', args);

type OrderingExpr<Ext extends Extension = NoExtension> = Tagged<'OrderingExpr', {
    readonly expr: Expr<Ext>,
    readonly order: 'ASC' | 'DESC' | null,
    readonly nullHandling: 'NULLS FIRST' | 'NULLS LAST' | null
}>;
const OrderingExpr = <Ext extends Extension = NoExtension>(
    args: UnTag<OrderingExpr<Ext>>
): OrderingExpr<Ext> => tag('OrderingExpr', args);

type SetOp<Ext extends Extension = NoExtension> = Tagged<'SetOp', {
    readonly func: 'UNION' | 'EXCEPT' | 'INTERSECT',
    readonly all: boolean,
    readonly select: Select<Ext>,
}>;
const SetOp = <Ext extends Extension = NoExtension>(args: UnTag<SetOp<Ext>>): SetOp<Ext> => tag('SetOp', args);

type Select<Ext extends Extension = NoExtension> = {
    readonly selections: Array<Selection>,
    readonly from: JoinedTable,
    readonly where: Expr | null,
    readonly groupBy: Array<Expr>,
    readonly having: Expr | null,
    readonly extensions: Ext['select'] | null,
};
const Select = <Ext extends Extension = NoExtension>(args: UnTag<Select<Ext>>): Select<Ext> => tag('Select', args);

type Selection =
    | AnonymousSelection
    | AliasedSelection;

type AnonymousSelection<Ext extends Extension = NoExtension> = Tagged<'AnonymousSelection', {
    readonly selection: Expr<Ext>,
}>;
const AnonymousSelection = <Ext extends Extension = NoExtension>(selection: Expr<Ext>): AnonymousSelection<Ext> => tag('AnonymousSelection', { selection });

/**
 * `foo AS bar`
 */
type AliasedSelection<Ext extends Extension = NoExtension> = Tagged<'AliasedSelection', {
    readonly selection: Expr<Ext>,
    readonly alias: Ident,
}>;
const AliasedSelection = <Ext extends Extension = NoExtension>(args: UnTag<AliasedSelection<Ext>>): AliasedSelection<Ext> => tag('AliasedSelection', args);

type JoinedTable<Ext extends Extension = NoExtension> = Tagged<'JoinedTable', {
    readonly name: Ident,
    readonly joins: Array<Join>,
}>;
const JoinedTable = <Ext extends Extension = NoExtension>(args: UnTag<JoinedTable<Ext>>): JoinedTable<Ext> => tag('JoinedTable', args);

type Join<Ext extends Extension = NoExtension> = Tagged<'Join', {
    readonly name: Ident,
    readonly kind: JoinKind,
    readonly on: Expr<Ext>,
}>;
const Join = <Ext extends Extension = NoExtension>(args: UnTag<Join<Ext>>): Join<Ext> => tag('Join', args);

enum JoinKind {
    Inner = 'INNER',
    LeftOuter = 'LEFT OUTER',
    RightOuter = 'RIGHT OUTER',
    FullOuter = 'FULL OUTER',
}

export {
    Query,
    CommonTableExpr,
    TableAlias,
    OrderingExpr,
    SetOp,
    Select,
    Selection,
    AnonymousSelection,
    AliasedSelection,
    JoinedTable,
    Join,
    JoinKind,
}

/* Extensions that will be needed
 * LIMIT ALL for Netezza
 * OFFSET FETCH
 * Recursive WITH for postgres and mysql
 */
