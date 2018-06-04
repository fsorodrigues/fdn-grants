// importing d3.js
import * as d3 from 'd3';

// importing bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

// importing stylesheets
import './style/main.css';
import './style/text.css';

// importing parsing functions from utils
import {fetchJson,fetchCsv,parse,parseMap} from './utils';

// importing modules
import StackedArea from './components/StackedArea';
import MapProjection from './components/MapProjection';
import Tooltip from './components/Tooltip';
import Table from './components/Table';

/* SETTING UP FACTORIES */

// Stacked Area Charts
const fundingBySector = StackedArea()
    .header({title:'Stacked Area Chart', sub:'who gets the funds?'})
    .footer({caption:'some caption text here', credit:'credit', source:'data source'})
    .svgId('svg-table1')
    .curve(d3.curveLinear);

const fundingByNationalGrants = StackedArea()
    .header({title:'Stacked Area Chart', sub:'national grants'})
    .footer({caption:'some caption text here', credit:'credit', source:'data source'})
    .svgId('svg-table3')
    .curve(d3.curveLinear);

const fundingByLocalGrants = StackedArea()
    .header({title:'Stacked Area Chart', sub:'local grants'})
    .footer({caption:'some caption text here', credit:'credit', source:'data source'})
    .svgId('svg-table4')
    .curve(d3.curveLinear);

// US Maps
const mapTotalsByState = MapProjection(document.querySelector('.table2-map-totals'))
    .header({title:'Map Totals By State', sub:'Major Markets'})
    .footer({caption:'some caption text here', credit:'credit', source:'data source'});

const mapNonProfitsByState = MapProjection(document.querySelector('.table5-map-non-profits'))
    .header({title:'Map Totals By State', sub:'Major Markets'})
    .footer({caption:'some caption text here', credit:'credit', source:'data source'});

// Accessories for tooltips
const tooltip = Tooltip();
const table = Table();

// importing data using Promise interface
Promise.all([
    fetchCsv('./data/table1-stackedarea.csv', parse),
    fetchCsv('./data/table2-map.csv', parseMap),
    fetchJson('./data/cb_2016_us_state_20m.json'),
    fetchCsv('./data/table3-stackedarea.csv', parse),
    fetchCsv('./data/table4-stackedarea.csv', parse),
    fetchCsv('./data/table5-map.csv', parseMap)
]).then(([table1,table2,usMap,table3,table4,table5]) => {

    d3.select('.table1-stacked-area')
        .datum(table1)
        .each(fundingBySector);

    d3.select('#svg-table1')
        .datum(table1)
        .each(tooltip);

    mapTotalsByState(table2,usMap);

    d3.select('.table3-stacked-area')
        .datum(table3)
        .each(fundingByNationalGrants);

    d3.select('#svg-table3')
        .datum(table3)
        .each(tooltip);

    d3.select('.table4-stacked-area')
        .datum(table4)
        .each(fundingByLocalGrants);

    d3.select('#svg-table4')
        .datum(table4)
        .each(tooltip);

    mapNonProfitsByState(table5,usMap);
});

tooltip.on('year:enter', function(svgContext,filterData) {
    table(filterData,svgContext);

    d3.select(svgContext)
        .select(`.guide-${filterData[0].year}`)
        .transition()
        .duration(250)
        .style('opacity', 1);
}).on('year:leave', function(svgContext,filterData) {

    d3.select(svgContext)
        .select(`.guide-${filterData[0].year}`)
        .transition()
        .duration(150)
        .style('opacity', 0);
});
