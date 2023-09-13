import sequelize, { Op } from 'sequelize';

export interface DateRange {
    start: Date;
    end: Date;
}

export const FilterString = (key: string, value: string): any => {
    return { [key]: { [Op.like]: `%${value.replace(/%/g, '\\%')}%` } };
};

export const FilterStringSparator = (key: string, value: string): any => {
    const values = value.split(',').map(a => a.trim());
    console.log(values);

    if (values.length === 1) {
        return { [key]: { [Op.like]: `%${values[0].replace(/%/g, '\\%')}%` } };
    } else {
        return {
            [key]: {
                [Op.or]: values.map(a => ({
                    [Op.like]: `%${a}%`
                }))
            }
        }
    };
}


export const FilterNumber = (key: string, value: number): any => {
    return value
        ? { [key]: value }
        : { };
}
export const FilterDateRange = (key: string, value: DateRange): any => {
    return { [key]: { [Op.between]: [value.start, value.end] } };
};

export const FilterCastToString = (key: string, value: string): any => {
    return {
        [key]: sequelize.literal(`CAST("${key}" AS TEXT) ILIKE '%${value}%'`)
    };
};

export const SortField = (key: string, sort: string) => [key, sort];

export const JsonFieldFilter = (column: string, jsonTitle: string, value: string): any => {
    const query = {
        [Op.and]: sequelize.literal(
            `${column}->>'${jsonTitle}' ILIKE '%${value}%'`
        )
    };
    return query;
};

export const JsonFieldSort = (column: string, jsonTitle: string, sort: string) => {
    const query = [[sequelize.literal(`"${column}" #>> '{${jsonTitle}}'`), sort]];
    return query;
};