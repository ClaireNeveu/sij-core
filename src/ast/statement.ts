import { Tagged, UnTag, tag, Extension, NoExtension } from './util';
import type { Query } from './query';
import type { Ident, Expr } from './expr';

type Statement<Ext extends Extension> =
    | Query<Ext>
    | Insert<Ext>
    | Update<Ext>
    | Delete<Ext>;

interface Insert<Ext extends Extension> extends Tagged<'Insert', {
    readonly table: Ident,
    readonly columns: Array<Ident>,
    readonly values: Values<Ext> | null,
    readonly extensions: Ext['Insert'] | null,
}> {};
const Insert = <Ext extends Extension>(args: UnTag<Insert<Ext>>): Insert<Ext> => tag('Insert', args);

/**
 * `DEFAULT` used in an INSERT statment, e.g. `INSERT INTO some_table (col, col2) VALUES (DEFAULT, 'foo')`
 */
interface DefaultValue extends Tagged<'DefaultValue', {}> {};
const DefaultValue = tag('DefaultValue', {});

type Values<Ext extends Extension> =
    | DefaultValues
    | ValuesConstructor<Ext>
    | ValuesQuery<Ext>;

interface DefaultValues extends Tagged<'DefaultValues', {}> {};
const DefaultValues = tag('DefaultValues', {});

interface ValuesConstructor<Ext extends Extension> extends Tagged<'ValuesConstructor', {
    readonly values: Array<Array<Expr<Ext> | DefaultValue>>
}> {};
const ValuesConstructor = <Ext extends Extension>(
    args: UnTag<ValuesConstructor<Ext>>
): ValuesConstructor<Ext> => tag('ValuesConstructor', args);

interface ValuesQuery<Ext extends Extension> extends Tagged<'ValuesQuery', {
    readonly query: Query<Ext>
}> {};
const ValuesQuery = <Ext extends Extension>(
    args: UnTag<ValuesQuery<Ext>>
): ValuesQuery<Ext> => tag('ValuesQuery', args);

interface Update<Ext extends Extension> extends Tagged<'Update', {
    readonly table: Ident,
    readonly assignments: Array<[Ident, Expr | DefaultValue]>,
    readonly where: Expr<Ext> | null,
    readonly extensions: Ext['Update'] | null,
}> {};
const Update = <Ext extends Extension>(args: UnTag<Update<Ext>>): Update<Ext> => tag('Update', args);

interface Delete<Ext extends Extension> extends Tagged<'Delete', {
    readonly table: Ident,
    readonly where: Expr<Ext> | null,
    readonly extensions: Ext['Delete'] | null,
}> {};
const Delete = <Ext extends Extension>(args: UnTag<Delete<Ext>>): Delete<Ext> => tag('Delete', args);

export {
    DefaultValue,
    DefaultValues,
    Delete,
    Insert,
    Statement,
    Update,
    ValuesConstructor,
    ValuesQuery,
};
