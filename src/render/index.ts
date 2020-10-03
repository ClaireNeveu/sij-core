import type { Expr, Ident } from '../ast/expr';
import type { DataType } from '../ast/data-type';
import type { Query, Select } from '../ast/query';
import type { Literal } from '../ast/literal';
import type { Extension, NoExtension } from '../ast/util';

class Renderer<Ext extends Extension = NoExtension> {
    renderIdent(ident: Ident): string {
        return `"${ident}"`;
    }
    
    renderExpr(expr: Expr): string {
        // Ident
        if (typeof expr === 'string') {
            return this.renderIdent(expr);
        }
        switch (expr._tag) {
            case 'Wildcard': return '*';
            case 'QualifiedWildcard': {
                const qualifiers = expr.qualifiers.map(this.renderExpr).join('.');
                return qualifiers === '' ? '*' : qualifiers + '.*';
            }
            case 'CompoundIdentifier': return expr.idChain.map(this.renderExpr).join('.');
            case 'Between': {
                const operand = this.renderExpr(expr.expr);
                const not = expr.negated ? ' NOT' : '';
                const low = this.renderExpr(expr.low);
                const high = this.renderExpr(expr.high);
                return `${operand}${not} BETWEEN ${low} AND ${high}`
            }
            case 'BinaryApp': {
                const left = this.renderExpr(expr.left);
                const right = this.renderExpr(expr.right);
                return `${left} ${expr.op} ${right}`
            }
            case 'Case': {
                const operand = expr.expr === null ? '' : ' ' + this.renderExpr(expr.expr);
                const cases = expr.cases.map(({ condition, result }) => (
                    `WHEN ${this.renderExpr(condition)} THEN ${this.renderExpr(result)}`
                ));
                const else_ = expr.elseCase === null ? '' : 'ELSE ' + this.renderExpr(expr.elseCase) + ' ';
                return `CASE${operand} ${cases.join(' ')} ${else_}END`
            }
            case 'Cast': return `CAST(${this.renderExpr(expr.expr)} AS ${this.renderDataType(expr.dataType)})`;
            case 'Collate': return `${this.renderExpr(expr.expr)} COLLATE ${this.renderExpr(expr.collation)}`;
            case 'Exists': return `EXISTS(${this.renderQuery(expr.subQuery)})`;
            case 'Extract': return `EXTRACT(${expr.field} FROM ${this.renderExpr(expr.source)})`;
            case 'FunctionApp': {
                const args = expr.args.map(this.renderExpr).join(', ');
                return `${this.renderExpr(expr.name)}(${args})`;
            }
            case 'IsNull': {
                const not = expr.negated ? ' NOT' : '';
                return `${this.renderExpr(expr.expr)} IS${not} NULL`;
            }
            case 'InList': {
                const not = expr.negated ? ' NOT' : '';
                const list = expr.list.map(this.renderExpr).join(', ');
                return `${this.renderExpr(expr.expr)}${not} IN (${list})`;
            }
            case 'InSubQuery': {
                const not = expr.negated ? ' NOT' : '';
                const sub = this.renderQuery(expr.subQuery);
                return `${this.renderExpr(expr.expr)}${not} IN (${sub})`;
            }
            case 'Lit': return this.renderLiteral(expr.literal);
            case 'Parenthesized': return `(${this.renderExpr(expr.expr)})`;
            case 'SubQuery': return `(${this.renderQuery(expr.query)})`;
            case 'UnaryApp': return `${expr.op}${this.renderExpr(expr.expr)}`;
            case 'ExprExtension': return this.renderCustomExpr(expr.val);
        }
        return 'OOPS, FORGOT TO IMPLEMENT A CASE';
    }
    renderCustomExpr(dt: Ext['expression']): string {
        throw Error('Custom expression encountered, please extend the renderer');
    }

    renderDataType(dt: DataType): string {
        throw Error('Unimplemented');
    }
    renderQuery(query: Query): string {
        const ctes = (() => {
            if (query.commonTableExprs.length == 0) {
                return '';
            }
            const subs = query.commonTableExprs.map(cte => {
                const cols = (
                    cte.alias.columns.length === 0
                        ? ''
                        : ` (${cte.alias.columns.map(this.renderIdent).join(', ')})`
                );
                return `${this.renderIdent(cte.alias.name)}${cols} AS`
            });
            return `WITH ${subs.join(', ')} `;
        })();

        const limit = query.limit === null ? '' : ` LIMIT ${this.renderExpr(query.limit)}`;
        const offset = query.offset === null ? '' : ` OFFSET ${this.renderExpr(query.offset)}`;
        const ordering = (() => {
            if (query.ordering.length === 0) {
                return '';
            }
            const orders = query.ordering.map(order => {
                const asc = order.order === null ? '' : ' ' + order.order;
                const nullHandling = order.nullHandling === null ? '' : ' ' + order.nullHandling;
                `${this.renderExpr(order.expr)}${asc}${nullHandling}`
            });
            return ` ORDER BY ${orders.join(', ')}`;
        })();
        const selection = this.renderSelect(query.selection);
        const unions = (() => {
            if (query.unions.length === 0) {
                return '';
            }
            return ' ' + query.unions.map(u => {
                const all = u.all ? ' ALL' : '';
                return ` ${u.func}${all} ${this.renderSelect(u.select)}`;
            }).join(' ');
        })();

        return `${ctes}${selection}${unions}${ordering}${limit}${offset}`;
    }
    
    renderSelect(select: Select<any>): string {
        const selections = select.selections.map(s => {
            switch (s._tag) {
                case 'AnonymousSelection': return this.renderExpr(s.selection);
                case 'AliasedSelection':
                    return `${this.renderExpr(s.selection)} AS ${this.renderIdent(s.alias)}`;
            }
        }).join(', ');

        const where = select.where === null ? '' : ' ' + this.renderExpr(select.where);
        const groupBy = (
            select.groupBy.length === 0
                ? ''
                : ' GROUP BY' + select.groupBy.map(this.renderExpr).join(', ')
        );
        const having = (
            select.having === null
                ? ''
                : ' HAVING' + this.renderExpr(select.having)
        );

        const table = 'TODO';

        return `SELECT ${selections} FROM ${table}${where}${groupBy}${having}`;
    }
    
    renderLiteral(literal: Literal): string {
        return literal;
    }
}

export {
    Renderer,
};
