// importing d3.js
import * as d3 from 'd3';

// importing modules
import {formatMoney} from '../utils';

// importing stylesheets
import '../style/table.css';

// setting up modules

// defining global variables

// defining Factory function
function Table(_) {

    // // create getter-setter variables in factory scope
    // let _header = {title:'title', sub:'subtitle'};
    // let _footer = {caption:'some caption text here', credit:'credit', source:'data source'};
    let _titles = ['state', 'amount'];

    function exports(data) {
        const root = this;

        // console.log(container.attr('id').replace('table', 'figure'));

        // selecting root element ==> chart container, div where function is called in index.js

        // declaring setup/layout variables

        // data transformation
        const top10 = data.sort((a,b) => d3.descending(a.amount,b.amount))
            .slice(0,10)
            .map(d => {
                return {
                    [_titles[0]]: d[_titles[0]],
                    [_titles[1]]: formatMoney(d[_titles[1]])
                };
            });

        // bind data and append table
        let tableUpdate = d3.select(root)
            .selectAll('.table')
            .data([1]);
        const tableEnter = tableUpdate.enter()
            .append('table');
        tableUpdate = tableUpdate.merge(tableEnter)
            .classed('table', true)
            .classed('table-sm', true);
        //
        // /* TABLE HEADER */
        // // <thead> element ===> table header wrapper
        // let theadUpdate = tableUpdate.selectAll('thead')
        //     .data([1]);
        // const theadEnter = theadUpdate.enter()
        //     .append('thead');
        // theadUpdate = theadUpdate.merge(theadEnter);
        // // <tr> element ===> row
        // let trhUpdate = theadUpdate.selectAll('tr')
        //     .data([1]);
        // const trhEnter = trhUpdate.enter()
        //     .append('tr');
        // trhUpdate = trhUpdate.merge(trhEnter);
        // // <th> elements ===> header cells
        // let thUpdate = trhUpdate.selectAll('th')
        //     .data(titles);
        // const thEnter = thUpdate.enter()
        //     .append('th');
        // thUpdate = thUpdate.merge(thEnter)
        //     .attr('scope', 'col')
        //     .text(d => d);

        /* TABLE BODY */
        // <tbody> element ===> table body wrapper
        let tbodyUpdate = tableUpdate.selectAll('tbody')
            .data([1]);
        const tbodyEnter = tbodyUpdate.enter()
            .append('tbody');
        tbodyUpdate = tbodyUpdate.merge(tbodyEnter);

        // <tr> elements ===> rows
        let trUpdate = tbodyUpdate.selectAll('tr')
            .data(top10);
        const trEnter = trUpdate.enter()
            .append('tr');
        trUpdate = trUpdate.merge(trEnter);

        // <td> elements ===> body cells
        let tdUpdate = trUpdate.selectAll('td')
            .data(d => {
                return _titles.map(e => {
                    return { "value": d[e], "name": e};
                });
            });
        const tdEnter = tdUpdate.enter()
            .append('td');
        tdUpdate = tdUpdate.merge(tdEnter)
            .text(d => d.value);

    }

    // // create getter-setter pattern for customization
    // exports.header = function(_) {
	// 	// _ is an object { title: }
	// 	if (typeof _ === "undefined") return _header;
	// 	_header = _;
	// 	return this;
	// };
    //
    // exports.footer = function(_) {
	// 	// _ is an object { title: }
	// 	if (typeof _ === "undefined") return _footer;
	// 	_footer = _;
	// 	return this;
	// };

    // returning module
    return exports;
}

// exporting factory function as default
export default Table;
