import {format} from 'd3';

export const parse = d => {
    return d;
};

export const parseMap = d => {
    return {
        state: d.State,
        amount: +d['Amount of Grants'],
        percent: +d.Percent,
        volume: +d['Number of Grants'],
        lat: +d.Lat,
        lon: +d.Lon
    };
};

export const totalsByYear = d => {
    const keys = [];
    for(var k in d) keys.push(k);
    const columns = keys.filter(d => d != 'year');
    let sum = 0;
    for (let i = 0; i < columns.length; i++) {
        sum = sum + (+d[columns[i]]);
    }
    return {
        year: +d.year,
        total: sum
    };
};

export const totalsBySector = d => {
    const keys = [];
    for(var k in d) keys.push(k);
    const columns = keys.filter(d => d != 'Group');
    let sum = 0;
    for (let i = 0; i < columns.length; i++) {
        sum = sum + (+d[columns[i]]);
    }
    return {
        sector: d.Group,
        total: sum
    };
};

export const formatNumber = format(',.0f');
export const formatYear = format('.0f');
export const formatThousands = format(',');
export const formatMillions = format('.2s');

export const formatPercent = format(',.2%');

export const formatMoney = d => {
    return "$" + formatThousands(d);
};

export const formatMillionsMoney = d => {
    return `$${formatMillions(d).replace('M','m')}`;
};

export const onlyUnique = (value, index, self) => self.indexOf(value) === index;
