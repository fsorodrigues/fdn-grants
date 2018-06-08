// importing d3.js
import * as d3 from 'd3';

// importing Scroll
 // require('jquery-scrollto')

// importing bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

// importing stylesheets
import './style/main.css';
import './style/text.css';

// importing parsing functions from utils
import {totalsBySector,totalsByYear,parse,parseMap} from './utils';

// importing modules
import LineChart from './components/LineChart';
import BarChart from './components/BarChart';
import MapProjection from './components/MapProjection';
import LocalScroll from './components/LocalScroll';
// import Tooltip from './components/Tooltip';
// import Table from './components/Table';

/* SETTING UP FACTORIES */
const chart01 = LineChart()
    .header({title:'U.S. foundation funding for nonprofit media and related activities, 2010-2015', sub:'subtitle?'})
    .footer({caption:'some caption text here', credit:'credit', source:'data source'})
    .curve(d3.curveLinear);

const chart02 = BarChart();

const chart03 = MapProjection(document.querySelector('.figure-03'));

const scroll = LocalScroll()
    .duration(1000);

// Stacked Area Charts
// const fundingBySector = LineChart()
//     .header({title:'Stacked Area Chart', sub:'who gets the funds?'})
//     .footer({caption:'some caption text here', credit:'credit', source:'data source'})
//     .svgId('svg-table1')
//     .curve(d3.curveLinear);
//
// const fundingByNationalGrants = LineChart()
//     .header({title:'Stacked Area Chart', sub:'national grants'})
//     .footer({caption:'some caption text here', credit:'credit', source:'data source'})
//     .svgId('svg-table3')
//     .curve(d3.curveLinear);
//
// const fundingByLocalGrants = LineChart()
//     .header({title:'Stacked Area Chart', sub:'local grants'})
//     .footer({caption:'some caption text here', credit:'credit', source:'data source'})
//     .svgId('svg-table4')
//     .curve(d3.curveLinear);
//
// // US Maps
// const mapTotalsByState = MapProjection(document.querySelector('.table2-map-totals'))
//     .header({title:'Map Totals By State', sub:'Major Markets'})
//     .footer({caption:'some caption text here', credit:'credit', source:'data source'});
//
// const mapNonProfitsByState = MapProjection(document.querySelector('.table5-map-non-profits'))
//     .header({title:'Map Totals By State', sub:'Major Markets'})
//     .footer({caption:'some caption text here', credit:'credit', source:'data source'});
//
// // Accessories for tooltips
// const tooltip = Tooltip();
// const table = Table();

const figure01 = d3.csv('./data/figure-01.csv',totalsByYear);
figure01.then((figure01) => {

    d3.select('.figure-01')
        .datum(figure01)
        .each(chart01);

});

const figure02 = d3.csv('./data/figure-02.csv',totalsBySector);
figure02.then((figure02) => {

    d3.select('.figure-02')
        .datum(figure02)
        .each(chart02);

});

const figure03 = d3.csv('./data/figure-03.csv',parseMap);
const mapTile = d3.json('./data/cb_2016_us_state_20m.json');

figure03.then((figure03) => {
    mapTile.then((usMap) => {
        chart03(figure03,usMap);
    });
});

// activating jQuery localScroll plugin
scroll('body');
