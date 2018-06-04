import {csv,json,format} from 'd3';

export const parse = d => {
    return d
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

export const fetchJson = (url) => {
	return new Promise((resolve, reject) => {
		json(url, (err, data) => {
			if(err){
				reject(err);
			}else{
				resolve(data);
			}
		})
	});
};

export const fetchCsv = (url, parse) => {
	return new Promise((resolve, reject) => {
		csv(url, parse, (err, data) => {
			if(err){
				reject(err);
			}else{
				resolve(data);
			}
		})
	});
};

export const formatNumber = format(',.0f');
export const formatYear = format('.0f');
export const formatThousands = format(',');

export const formatPercent = format(',.2%');

export const formatMoney = d => {
    return "$" + formatThousands(d);
};

export const onlyUnique = (value, index, self) => self.indexOf(value) === index;
