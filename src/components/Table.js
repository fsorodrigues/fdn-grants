// importing d3.js
import * as d3 from 'd3';

// importing modules
import {} from '../utils';

// importing stylesheets
import '../style/table.css';

// setting up modules

// defining global variables

// defining Factory function
function Table(_) {

    // create getter-setter variables in factory scope
    let _header = {title:'title', sub:'subtitle'};
    let _footer = {caption:'some caption text here', credit:'credit', source:'data source'};

    function exports(data,svg) {
        // selecting root element ==> chart container, div where function is called in index.js
        const rootId = d3.select(svg).attr('id').replace('svg', 'tooltip');
        const root = d3.select(`.${rootId}`);

        // declaring setup/layout variables

        // data transformation
        const unstackData = [];
        const listSectors = [];
        for (var key in data[0]) {
            unstackData.push({
                sector:key,
                value: +data[0][key]
            });
            listSectors.push(key);
        }

        const dataBySector = unstackData.filter(d => d.sector != 'year')
            // .sort((a,b) => d3.ascending(a.value, b.value))
            .map(d => {
                return {
                    sector:d.sector,
                    value: formatMoney(d.value)
                };
            });
        const sectors = listSectors.filter(d => d != 'year');
        const titles = ['sector', 'value'];

        // setting up color scale
        // const scaleColor = d3.scaleOrdinal(d3.schemeCategory20);
        const scaleColor = d3.scaleOrdinal()
            .domain(sectors)
            .range(['#ff4500','#ff6426','#ff7c3f','#ff9155','#ffa36a','#ffb67f','#ffc794','#ffd8a7','#ffe9bc','#fafad2']);

        // add year title
        let titleUpdate = root.selectAll('.year-title')
            .data([data[0].year]);
        const titleEnter = titleUpdate.enter()
            .append('h2');
        titleUpdate = titleUpdate.merge(titleEnter)
            .classed('year-title', true)
            .text(d => `Funding in ${d}`);

        // bind data and append table
        let tableUpdate = root.selectAll('.table')
            .data([1]);
        const tableEnter = tableUpdate.enter()
            .append('table');
        tableUpdate = tableUpdate.merge(tableEnter)
            .classed('table', true);

        /* TABLE HEADER */
        // <thead> element ===> table header wrapper
        let theadUpdate = tableUpdate.selectAll('thead')
            .data([1]);
        const theadEnter = theadUpdate.enter()
            .append('thead');
        theadUpdate = theadUpdate.merge(theadEnter);
        // <tr> element ===> row
        let trhUpdate = theadUpdate.selectAll('tr')
            .data([1]);
        const trhEnter = trhUpdate.enter()
            .append('tr');
        trhUpdate = trhUpdate.merge(trhEnter);
        // <th> elements ===> header cells
        let thUpdate = trhUpdate.selectAll('th')
            .data(titles);
        const thEnter = thUpdate.enter()
            .append('th');
        thUpdate = thUpdate.merge(thEnter)
            .attr('scope', 'col')
            .text(d => d);

        /* TABLE BODY */
        // <tbody> element ===> table body wrapper
        let tbodyUpdate = tableUpdate.selectAll('tbody')
            .data([1]);
        const tbodyEnter = tbodyUpdate.enter()
            .append('tbody');
        tbodyUpdate = tbodyUpdate.merge(tbodyEnter);

        // <tr> elements ===> rows
        let trUpdate = tbodyUpdate.selectAll('tr')
            .data(dataBySector);
        const trEnter = trUpdate.enter()
            .append('tr');
        trUpdate = trUpdate.merge(trEnter)
            .style('background-color', d => scaleColor(d.sector));

        // <td> elements ===> body cells
        let tdUpdate = trUpdate.selectAll('td')
            .data(d => {
                return titles.map(e => {
                    return { "value": d[e], "name": e};
                });
            });
        const tdEnter = tdUpdate.enter()
            .append('td');
        tdUpdate = tdUpdate.merge(tdEnter)
            .text(d => d.value);

    }

    // create getter-setter pattern for customization
    exports.header = function(_) {
		// _ is an object { title: }
		if (typeof _ === "undefined") return _header;
		_header = _;
		return this;
	};

    exports.footer = function(_) {
		// _ is an object { title: }
		if (typeof _ === "undefined") return _footer;
		_footer = _;
		return this;
	};

    // returning module
    return exports;
}

// exporting factory function as default
export default Table;
