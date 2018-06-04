// importing d3.js
import * as d3 from 'd3';

// importing modules
import {formatMoney,formatYear} from '../utils';

// importing stylesheets
import '../style/axis.css';

// setting up modules

// defining global variables

// defining Factory function
function StackedArea(_) {

    // create getter-setter variables in factory scope
    let _header = {title:'title', sub:'subtitle'};
    let _footer = {caption:'some caption text here', credit:'credit', source:'data source'};
    let _curve = d3.curveBasis;
    let _svgId = 'svg';

    function exports(data) {
        // selecting root element ==> chart container, div where function is called in index.js
        const root = this;
        const container = d3.select(root);

        const totalsByYear = data.map(d => {
            const columns = data.columns;
            let sum = 0;
            for (let i = 1; i < columns.length; i++) {
                sum = sum + (+d[columns[i]]);
            }
            return {
                year: d.year,
                total: sum
            };
        });

        // declaring setup/layout variables
        const width = root.clientWidth;
        const height = root.clientHeight;
        const margin = {t:20, r:20, b:20, l:65};
        const w = width - (margin.r + margin.l);
        const h = height - (margin.t + margin.b);

        /* HEADER */
        // appending <div> node for header
        // enter-exit-update pattern

        // update selection
        let headerUpdate = container.selectAll('.chart-header')
            .data([_header]);
        // enter selection
        const headerEnter = headerUpdate.enter()
            .append('div');
        // exit selection
        headerUpdate.exit().remove();
        // enter + update selection
        headerUpdate = headerUpdate.merge(headerEnter)
            .classed('chart-header', true);

        // appending header (title and sub) to node
        // update selection
        let titleUpdate = headerUpdate.selectAll('.chart-title')
            .data(d => [d.title]);
        // enter selection
        const titleEnter = titleUpdate.enter()
            .append('h3');
        // exit selection
        titleUpdate.exit().remove();
        // enter + update selection
        titleUpdate = titleUpdate.merge(titleEnter)
            .classed('chart-title', true)
            .text(d => d);

        // update selection
        let subtitleUpdate = headerUpdate.selectAll('.chart-subtitle')
            .data(d => [d.sub]);
        // enter selection
        const subtitleEnter = subtitleUpdate.enter()
            .append('h4');
        // exit selection
        subtitleUpdate.exit().remove();
        // enter + update selection
        subtitleUpdate = subtitleUpdate.merge(subtitleEnter)
            .classed('chart-subtitle', true)
            .text(d => d);

        // appending SVG to root
        // enter-exit-update pattern

        // update selection
        let svgUpdate = container.selectAll('.stacked-area')
            .data([1]);
        // enter selection
        const svgEnter = svgUpdate.enter()
            .append('svg');
        // exit selection
        svgUpdate.exit().remove();
        // update + enter selection
        svgUpdate = svgUpdate.merge(svgEnter)
            .attr('id', _svgId)
            .classed('stacked-area',true)
            .attr('width', width)
            .attr('height', height);

        // appending <g> element to SVG
        // enter-exit-update pattern

        // update selection
        let plot = svgUpdate.selectAll('.plot-stacked-area')
            .data([1]);
        // enter selection
        const plotEnter = plot.enter()
            .append('g');
        // exit selection
        plot.exit().remove();
        // update + enter selection
        plot = plot.merge(plotEnter)
            .classed('plot-stacked-area', true)
            .attr('transform', `translate(${margin.l},${margin.t})`);

        // list of sectors
        const sectors = data.columns.filter(d => d !== 'year');
        // list of years
        const years = data.map(d => +d.year);

        // declaring stacking function
        const stack = d3.stack()
            .keys(sectors);
        // applying stacking function to data
        const stackedData = stack(data);

        // setting up scales
        const scaleX = d3.scaleLinear()
            .range([0,w])
            .domain(d3.extent(years));
        const scaleY = d3.scaleLinear()
            .range([h,0])
            .domain([0,d3.max(totalsByYear, d => d.total)]);
        // const scaleColor = d3.scaleOrdinal(d3.schemeCategory20);
        const scaleColor = d3.scaleOrdinal()
            .domain(sectors)
            .range(['#ff4500','#ff6426','#ff7c3f','#ff9155','#ffa36a','#ffb67f','#ffc794','#ffd8a7','#ffe9bc','#fafad2']);
        const scaleColorInvert = d3.scaleOrdinal()
            .domain(sectors)
            .range(['#fafad2','#ffe9bc','#ffd8a7','#ffc794','#ffb67f','#ffa36a','#ff9155','#ff7c3f','#ff6426','#ff4500']);

        // setting up line generator path
        const area = d3.area()
            .x(d => scaleX(d.data.year))
            .y0(d => scaleY(d[0]))
            .y1(d => scaleY(d[1]))
            .curve(_curve);

        const line = d3.line()
            .x(d => scaleX(d.data.year))
            .y(d => scaleY(d[1]))
            .curve(_curve);

        // appending <g> to plot
        // individual <g> for areas
        // enter-exit-update pattern

        // update selection
        let areasUpdate = plot.selectAll('.area')
            .data(stackedData);
        // enter selection
        const areasEnter = areasUpdate.enter()
            .append('g');
        // exit selection
        areasUpdate.exit().remove();
        // update + enter selection
        areasUpdate = areasUpdate.merge(areasEnter)
            .attr("class", d => d.key.replace(',', '').split(' ').join('-'))
            .classed('area', true);

        // appending path to groups
        areasUpdate.append('path')
            .classed('area-path', true)
            .attr('d', area)
            .style('fill', d => scaleColor(d.key))
            .style('fill-opacity',1)
        areasUpdate.append('path')
            .classed('area-path', true)
            .attr('d', line)
            .style('fill', 'none')
            .style('stroke', d => scaleColorInvert(d.key))
            .style('stroke-width', 1);

        // // appending legend to header
        // areasUpdate.append('text')
        //     .text(d => d.key)
        //     .style('text-anchor', 'start')
        //     .attr('transform', (d,i) => `translate(${w+10},${scaleY((d[5][0]+d[5][1])/2)-i})`)
        //     .attr('fill-opacity', 1);

        //Set up axis generator
        const axisY = d3.axisLeft()
            .scale(scaleY)
            .tickSize(-w)
            .ticks(5)
            .tickFormat(d => formatMoney(d));

        const axisX = d3.axisBottom()
            .scale(scaleX)
            .ticks(5)
            .tickFormat(d => formatYear(d));

        // draw axis
        // x-axis
        const axisXNode = plot
            .selectAll('.axis-x')
            .data([1]);
        const axisXNodeEnter = axisXNode.enter()
            .append('g')
            .attr('class','axis axis-x');
        axisXNode.merge(axisXNodeEnter)
            .attr('transform',`translate(0,${h})`)
            .call(axisX);
        // y-axis
        const axisYNode = plot
            .selectAll('.axis-y')
            .data([1]);
        const axisYNodeEnter = axisYNode.enter()
            .append('g')
            .attr('class','axis axis-y');
        axisYNode.merge(axisYNodeEnter)
            .attr('transform',`translate(${0},${0})`)
            .call(axisY);

        /* FOOTER */
        // appending <div> node for footer
        let footerUpdate = container.selectAll('.chart-footer')
            .data([_footer]);
        const footerEnter = footerUpdate.enter()
            .append('div');
        footerUpdate.exit().remove();
        footerUpdate = footerUpdate.merge(footerEnter)
            .classed('chart-footer', true)
            .classed('row', true);

        // appending footer (caption, credit and source) to node
        let captionUpdate = footerUpdate.selectAll('.chart-caption')
            .data(d => [d.caption]);
        const captionEnter = captionUpdate.enter()
            .append('div');
        captionUpdate = captionUpdate.merge(captionEnter)
            .classed('chart-caption', true)
            .classed('col-md-12', true)
            .text(d => d);

        let creditUpdate = footerUpdate.selectAll('.chart-credit')
            .data(d => [d.credit]);
        const creditEnter = creditUpdate.enter()
            .append('div');
        creditUpdate = creditUpdate.merge(creditEnter)
            .classed('chart-credit', true)
            .classed('col-md-6', true)
            .html(d => d);

        let sourceUpdate = footerUpdate.selectAll('.chart-source')
            .data(d => [d.source]);
        const sourceEnter = sourceUpdate.enter()
            .append('div');
        sourceUpdate = sourceUpdate.merge(sourceEnter)
            .classed('chart-source', true)
            .classed('col-md-6', true)
            .style('text-align', 'right')
            .html(d => d);

    }

    // create getter-setter pattern for customization
    exports.header = function(_) {
		// _ is an object { title: }
		if (typeof _ === "undefined") return _header;
		_header = _;
		return this
	};

    exports.footer = function(_) {
		// _ is an object { title: }
		if (typeof _ === "undefined") return _footer;
		_footer = _;
		return this
	};

    exports.curve = function(_) {
		// _ is a d3 built-in function
		if (typeof _ === "undefined") return _curve;
		_curve = _;
		return this
	};

    exports.svgId = function(_) {
        // _ is a string
        if (typeof _ === "undefined") return _svgId;
		_svgId = _;
		return this
    };

    // returning module
    return exports;
}

// exporting factory function as default
export default StackedArea;
