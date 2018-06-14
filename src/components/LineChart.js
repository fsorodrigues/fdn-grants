// importing d3.js
import * as d3 from 'd3';

// importing modules
import {formatThousands,formatYear,isFirefox} from '../utils';

// importing stylesheets
import '../style/axis.css';

// setting up modules

// defining global variables
const firefox = isFirefox();

// defining Factory function
function LineChart(_) {

    /* CREATE GETTER SETTER PATTERN */
    let _header = {title:'title', sub:'subtitle'};
    let _footer = {caption:'some caption text here', credit:'credit'};
    let _margin = {t:20, r:5, b:20, l:35};
    let _curve = d3.curveBasis;
    let _xAxis = 'year';
    let _yAxis = 'total';

    function exports(data) {
        // selecting root element ==> chart container, div where function is called in index.js
        const root = this;
        const container = d3.select(root)

        // console.log(data);

        // declaring setup/layout variables
        const clientWidth = root.clientWidth;
        const clientHeight = root.clientHeight;
        const clientPadding = () => {
            if (firefox) {
                return [0,15];
            } else {
                return d3.select(root).style('padding').replace(/px/gi, '').split(' ');
            }
        };
        const getPadding = clientPadding();
        const padding = {t:+getPadding[0], r:+getPadding[1], b:+getPadding[0], l:+getPadding[1]};
        const width = clientWidth - (padding.r + padding.l);
        const height = clientHeight - (padding.t + padding.b);
        const margin = _margin;
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
        let svgUpdate = container.selectAll('.line-chart')
            .data([1]);
        // enter selection
        const svgEnter = svgUpdate.enter()
            .append('svg');
        // exit selection
        svgUpdate.exit().remove();
        // update + enter selection
        svgUpdate = svgUpdate.merge(svgEnter)
            .classed('line-chart',true)
            .attr('width', width)
            .attr('height', height);

        // appending <g> element to SVG
        // enter-exit-update pattern
        // update selection
        let plot = svgUpdate.selectAll('.plot')
            .data([1]);
        // enter selection
        const plotEnter = plot.enter()
            .append('g');
        // exit selection
        plot.exit().remove();
        // update + enter selection
        plot = plot.merge(plotEnter)
            .classed('plot', true)
            .attr('transform', `translate(${margin.l},${margin.t})`);

        // setting up scales
        const scaleX = d3.scaleLinear()
            .range([0,w])
            .domain(d3.extent(data, d => d[_xAxis]));
        const scaleY = d3.scaleLinear()
            .range([h,0])
            .domain([0,d3.max(data, d => d[_yAxis])]);

        // console.log(scaleY(d3.max(data, d => d[_yAxis])),d3.max(data, d => d[_yAxis]),scaleY(100))

        // const scaleColor = d3.scaleOrdinal()
        //     .domain(sectors)
        //     .range(['#ff4500','#ff6426','#ff7c3f','#ff9155','#ffa36a','#ffb67f','#ffc794','#ffd8a7','#ffe9bc','#fafad2']);
        // const scaleColorInvert = d3.scaleOrdinal()
        //     .domain(sectors)
        //     .range(['#fafad2','#ffe9bc','#ffd8a7','#ffc794','#ffb67f','#ffa36a','#ff9155','#ff7c3f','#ff6426','#ff4500']);

        // setting up line generator path
        const line = d3.line()
            .x(d => scaleX(d[_xAxis]))
            .y(d => scaleY(d[_yAxis]))
            .curve(_curve);

        // appending <g> to plot
        // individual <g> for areas
        // enter-exit-update pattern
        // update selection
        let linesUpdate = plot.selectAll('.line')
            .data([data]);
        // enter selection
        const linesEnter = linesUpdate.enter()
            .append('g');
        // exit selection
        linesUpdate.exit().remove();
        // update + enter selection
        linesUpdate = linesUpdate.merge(linesEnter)
            .classed('line', true);

        // appending path to groups
        linesUpdate.append('path')
            .classed('area-path', true)
            .attr('d', line)
            .style('stroke', 'black')
            .style('stroke-width',2)
            .style('fill', 'none')
            .style('fill-opacity',1);

        //Set up axis generator
        const axisY = d3.axisLeft()
            .scale(scaleY)
            .tickSize(-w)
            .ticks(5)
            .tickFormat(d => formatThousands(d));

        const axisX = d3.axisBottom()
            .scale(scaleX)
            .ticks(5)
            .tickFormat(d => formatYear(d));

        // draw axis
        // x-axis
        const axisXNode = plot.selectAll('.axis-x')
            .data([1]);
        const axisXNodeEnter = axisXNode.enter()
            .append('g')
            .attr('class','axis axis-x');
        axisXNode.merge(axisXNodeEnter)
            .attr('transform',`translate(0,${h})`)
            .call(axisX);
        // y-axis
        const axisYNode = plot.selectAll('.axis-y')
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
            .classed('col-md-8', true)
            .text(d => d);

        let creditUpdate = footerUpdate.selectAll('.chart-credit')
            .data(d => [d.credit]);
        const creditEnter = creditUpdate.enter()
            .append('div');
        creditUpdate = creditUpdate.merge(creditEnter)
            .classed('chart-credit', true)
            .classed('col-md-4', true)
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

    exports.xAxis = function(_) {
        // _ is a string ===> encodes y
        if (_ === 'undefined') return _xAxis;
        _xAxis = _;
        return this;
    };

    exports.yAxis = function(_) {
        // _ is a string ===> encodes y
        if (_ === 'undefined') return _yAxis;
        _yAxis = _;
        return this;
    };

    // returning module
    return exports;
}

// exporting factory function as default
export default LineChart;
