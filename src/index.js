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
import {totalsBySector,totalsByYear,parse,parseMap,formatMoney,isMobile} from './utils';

// importing modules
import LineChart from './components/LineChart';
import AnnotationLine from './components/AnnotationLine';
import BarChart from './components/BarChart';
import MapProjection from './components/MapProjection';
import LocalScroll from './components/LocalScroll';
import Table from './components/Table';
import Legend from './components/Legend';

// start mobile check
const mobile = isMobile();

/* SETTING UP FACTORIES */
/* LineChart */
const chart01 = LineChart()
    .header({title:'Newsroom employees at U.S. newspapers, 2000-2015', sub:''})
    .footer({caption:'', credit:''})
    .curve(d3.curveLinear)
    .xAxis('year')
    .yAxis('total');
/* 2008 line annotation */
const annotationChart01 = AnnotationLine()
    .year(2008);

/* Horizontal Bars */
const chart02 = BarChart()
    .header({title:'U.S. foundation funding for nonprofit media-related activities, 2010-2015', sub:''})
    .footer({caption:'', credit:''});
const chart04 = BarChart()
    .header({title:'U.S. foundation funding for national news nonprofits, 2010-2015', sub:''})
    .footer({caption:'', credit:''});
const chart05a = BarChart()
    .header({title:'Deep vertical foundation funding at national news nonprofits, 2010-2015', sub:''})
    .footer({caption:'', credit:''});
const chart05b = BarChart()
    .header({title:'Subject specific foundation funding at national news nonprofits, 2010-2015', sub:''})
    .footer({caption:'', credit:''});
const chart06 = BarChart()
    .header({title:'U.S. foundation funding for local news nonprofits, 2010-2015', sub:''})
    .footer({caption:'', credit:''});
const chart07a = BarChart()
    .header({title:'Deep vertical foundation funding at local/state news nonprofits, 2010-2015 5', sub:''})
    .footer({caption:'', credit:''});
const chart07b = BarChart()
    .header({title:'Subject specific foundation funding at local/state news nonprofits, 2010-2015', sub:''})
    .footer({caption:'', credit:''});
const chart09 = BarChart()
    .header({title:'U.S. foundation funding for university-based journalism initiatives, 2010-2015', sub:''})
    .footer({caption:'', credit:''});

/* Maps */
const chart03 = MapProjection(document.querySelector('.figure-03'))
    .header({title:'U.S. foundation funding for national news nonprofits, 2010-2015', sub:''})
    .footer({caption:'', credit:''});
const chart08 = MapProjection(document.querySelector('.figure-08'))
    .header({title:'U.S. foundation funding for local/state news nonprofits by state, 2010-2015 ', sub:''})
    .footer({caption:'', credit:''});
const chart10 = MapProjection(document.querySelector('.figure-10'))
    .header({title:'Funding for university-based journalism initiatives by state, 2010-2015', sub:''})
    .footer({caption:'', credit:''});
/* tables for Maps */
const table = Table();
/* legend for Maps */
const legend = Legend();

/* SEAMLESS SCROLL */
const scroll = LocalScroll()
    .duration(800);

/* LOADING DATA AND CALLING VISUALS */
const figure01 = d3.csv('./data/figure-1.csv',totalsByYear);
figure01.then((figure01) => {
    const div_figure01 = d3.select('.figure-01');

    div_figure01.datum(figure01)
        .each(chart01);

    div_figure01.datum(figure01)
        .each(annotationChart01);

});

const figure02 = d3.csv('./data/figure-2.csv',totalsBySector);
figure02.then((figure02) => {

    d3.select('.figure-02')
        .datum(figure02)
        .each(chart02);

});

const figure03 = d3.csv('./data/figure-3.csv',parseMap);
const mapTile = d3.json('./data/cb_2016_us_state_20m.json');
figure03.then((figure03) => {
    mapTile.then((usMap) => {

        chart03(figure03,usMap);

        d3.select('.table-03')
            .datum(figure03)
            .each(table);

        d3.select('.legend-03')
            .datum(figure03)
            .each(legend);

    });
});

const figure04 = d3.csv('./data/figure-4.csv',totalsBySector);
figure04.then((figure04) => {

    d3.select('.figure-04')
        .datum(figure04)
        .each(chart04);

});

const figure05a = d3.csv('./data/figure-5a.csv',totalsBySector);
figure05a.then((figure05a) => {

    d3.select('.figure-05a')
        .datum(figure05a)
        .each(chart05a);

});

const figure05b = d3.csv('./data/figure-5b.csv',totalsBySector);
figure05b.then((figure05b) => {

    d3.select('.figure-05b')
        .datum(figure05b)
        .each(chart05b);

});

const figure06 = d3.csv('./data/figure-6.csv',totalsBySector);
figure06.then((figure06) => {

    d3.select('.figure-06')
        .datum(figure06)
        .each(chart06);

});

const figure07a = d3.csv('./data/figure-7a.csv',totalsBySector);
figure07a.then((figure07a) => {

    d3.select('.figure-07a')
        .datum(figure07a)
        .each(chart07a);

});

const figure07b = d3.csv('./data/figure-7b.csv',totalsBySector);
figure07b.then((figure07b) => {

    d3.select('.figure-07b')
        .datum(figure07b)
        .each(chart07b);

});

const figure08 = d3.csv('./data/figure-8.csv',parseMap);
figure08.then((figure08) => {
    mapTile.then((usMap) => {

        chart08(figure08,usMap);

        d3.select('.table-08')
            .datum(figure08)
            .each(table);

        legend.circlesData([5,10,20]);
        d3.select('.legend-08')
            .datum(figure08)
            .each(legend);

    });
});

const figure09 = d3.csv('./data/figure-9.csv',totalsBySector);
figure09.then((figure09) => {

    d3.select('.figure-09')
        .datum(figure09)
        .each(chart09);

});

const figure10 = d3.csv('./data/figure-10.csv',parseMap);
figure10.then((figure10) => {
    mapTile.then((usMap) => {

        chart10(figure10,usMap);

        d3.select('.table-10')
            .datum(figure10)
            .each(table);

        legend.circlesData([1,2.5,5]);
        d3.select('.legend-10')
            .datum(figure10)
            .each(legend);

    });
});

if (mobile === false) {
    chart03.on('circle:enter', function(d,tooltip) {
        const mouse = d3.mouse(this);
        tooltip.style('position','absolute')
            .style('padding', '1rem')
            .style('background-color', 'gainsboro')
            .style('font-size', '0.7rem')
            .style('top',`${mouse[1]+105}px`)
            .style('left',`${mouse[0]+60}px`)
            .style('z-index',10)
            .style('pointer-events','none')
            .style('opacity',0)
            .transition()
            .duration(350)
            .style('opacity',1);

        tooltip.html(`<strong>${d.state}:</strong> ${formatMoney(d.amount)}`);

    }).on('circle:leave', function(d,tooltip) {
        tooltip.transition()
            .duration(200)
            .style('opacity',0)
            .transition()
            // .style('top',`${0}px`)
            .style('left',`${0}px`);

    });

    chart08.on('circle:enter', function(d,tooltip) {
        const mouse = d3.mouse(this);
        tooltip.style('position','absolute')
            .style('padding', '1rem')
            .style('background-color', 'gainsboro')
            .style('font-size', '0.7rem')
            .style('top',`${mouse[1]+105}px`)
            .style('left',`${mouse[0]+60}px`)
            .style('z-index',10)
            .style('pointer-events','none')
            .style('opacity',0)
            .transition()
            .duration(350)
            .style('opacity',1);

        tooltip.html(`${d.state}: ${formatMoney(d.amount)}`);

    }).on('circle:leave', function(d,tooltip) {
        tooltip.transition()
            .duration(200)
            .style('opacity',0)
            .transition()
            // .style('top',`${0}px`)
            .style('left',`${0}px`);
    });

    chart10.on('circle:enter', function(d,tooltip) {
        const mouse = d3.mouse(this);
        tooltip.style('position','absolute')
            .style('padding', '1rem')
            .style('background-color', 'gainsboro')
            .style('font-size', '0.7rem')
            .style('top',`${mouse[1]+105}px`)
            .style('left',`${mouse[0]+60}px`)
            .style('z-index',10)
            .style('pointer-events','none')
            .style('opacity',0)
            .transition()
            .duration(350)
            .style('opacity',1);

        tooltip.html(`${d.state}: ${formatMoney(d.amount)}`);

    }).on('circle:leave', function(d,tooltip) {
        tooltip.transition()
            .duration(200)
            .style('opacity',0)
            .transition()
            // .style('top',`${0}px`)
            .style('left',`${0}px`);
    });
}

// activating jQuery localScroll plugin
scroll('body');
