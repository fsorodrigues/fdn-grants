// importing d3.js
import * as d3 from 'd3';

// importing accessory functions
import {formatMillionsMoney,formatPercent} from '../utils.js';

// importing stylesheets
import '../style/axis.css';

// defining Factory function
function BarChart(_) {

    // TO DO: create getter-setter variables in factory scope
    let _header = {title:'title', sub:'subtitle'};
    let _footer = {caption:'some caption text here', credit:'credit'};
    let _barLength = 'total';
    let _xScale = 'total';
    let _yAxis = 'sector';
    let _axisOpacity = 0;
    let _margin = {t:30, r:95, b:15, l:0};
    let _barColor = 'green'

    function exports(data) {

        // selecting root element ==> svg container, div where function is called in index.js
        const root = this;
        const container = d3.select(root);

        // declaring setup/layout variables
        const clientWidth = root.clientWidth;
        const clientHeight = root.clientHeight;
        const getPadding = d3.select(root).style('padding').replace(/px/gi, '').split(' ');
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

        // appending svg & <g> plot
        // update selection
        let svg = d3.select(root)
            .selectAll('svg')
            .data([1]);
        // enter selection
        const svgEnter = svg.enter()
            .append('svg');
        // exit selection
        svg.exit().remove();
        // enter+update selection
        svg = svg.merge(svgEnter)
            .attr('height', height)
            .attr('width', width);

        // update selection
        let barPlotUpdate = svg.selectAll('.bar-plot')
            .data([1]);
        // enter selection
        const barPlotEnter = barPlotUpdate.enter()
            .append('g')
            .classed('bar-plot', true)
			.attr('transform',`translate(${margin.l},${margin.t})`);
        // exit selection
        barPlotUpdate.exit().remove();
        // enter+update selection
        barPlotUpdate = barPlotUpdate.merge(barPlotEnter);

        // update selection
        let textPlotUpdate = svg.selectAll('.text-plot')
            .data([1]);
        // enter selection
        const textPlotEnter = textPlotUpdate.enter()
            .append('g')
            .classed('text-plot', true)
			.attr('transform',`translate(${margin.l},${margin.t-10})`);
        // exit selection
        textPlotUpdate.exit().remove();
        // enter+update selection
        textPlotUpdate = textPlotUpdate.merge(textPlotEnter);

        // Setting up scales
        const scaleY = d3.scaleBand()
            .domain(data.map(d => d[_yAxis]))
            .range([0,h])
            .paddingInner(0.5)
            .round(true);

        const barHeight = scaleY.bandwidth();

        const sumVolume = d3.sum(data,d => d.total);
        const maxVolume = d3.max(data, d => d[_xScale]);
        const scaleX = d3.scaleLinear()
            .domain([0, maxVolume])
            .range([0,w])
            .nice();

        // append rects to plot
        let binsUpdate = barPlotUpdate.selectAll('.bin')
            .data(data);
        const binsEnter = binsUpdate.enter()
            .append('rect');
        binsUpdate.exit().remove();
        binsUpdate = binsUpdate.merge(binsEnter)
            .attr('class', d => `bin-${d.sector}`)
            .classed('bin', true)
            .attr('x', 0)
            .attr('y', d => scaleY(d[_yAxis]))
            .attr('height', barHeight)
            .attr('width', d => scaleX(d[_barLength]))
            .style('fill', _barColor);

        // append labels to plot
        let labelsUpdate = textPlotUpdate.selectAll('.label')
            .data(data);
        const labelsEnter = labelsUpdate.enter()
            .append('text');
        labelsUpdate.exit().remove();
        labelsUpdate = labelsUpdate.merge(labelsEnter)
            .attr('class', d => `label-${d.sector}`)
            .classed('label', true)
            .attr('x', 0)
            .attr('y', d => scaleY(d[_yAxis]))
            .text(d => d.sector);

        // append values to plot
        let valuesUpdate = barPlotUpdate.selectAll('.value')
            .data(data);
        const valuesEnter = valuesUpdate.enter()
            .append('text');
        valuesUpdate.exit().remove();
        valuesUpdate = valuesUpdate.merge(valuesEnter)
            .attr('class', d => `value-${d.sector}`)
            .classed('value',true)
            .attr('x', d => scaleX(d[_barLength])+8)
            .attr('y', d => scaleY(d[_yAxis])+21)
            .style('fill', _barColor)
            .html(d => `${formatMillionsMoney(d.total)} <tspan>(${formatPercent(d.total/sumVolume)})</tspan>`);

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

        // Set up axis generator
		// const axisY = d3.axisLeft()
		// 	.scale(scaleY)
		// 	.tickSize(0);
		// const axisX = d3.axisBottom()
		// 	.scale(scaleX)
        //     .tickSize(-(h))
        //     .ticks(5);
        // .tickFormat(d => formatNumber(d))
		// .ticks(_tickX)
		// .tickFormat(_tickXFormat);

        //Axis
		// const axisXNode = barPlotUpdate.selectAll('.axis-x')
		// 	.data([1]);
		// const axisXNodeEnter = axisXNode.enter()
		// 	.append('g')
		// 	.attr('class','axis axis-x');
		// axisXNode.merge(axisXNodeEnter)
		// 	.attr('transform',`translate(0,${h})`)
		// 	.call(axisX)
        //     .selectAll('text')
        //     .attr('dx', -3);

		// const axisYNode = plotUpdate.selectAll('.axis-y')
		// 	.data([1]);
		// const axisYNodeEnter = axisYNode.enter()
		// 	.append('g')
		// 	.attr('class','axis axis-y');
		// axisYNode.merge(axisYNodeEnter)
        //     .attr('transform',`translate(-${3},${0})`)
		// 	.call(axisY);

        // plotUpdate.select('.axis-y')
        //     .select('.tick:first-of-type')
        //     .style('opacity',_axisOpacity);

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

    exports.barHeight = function(_) {
        // _ expects a string ===> accessor to column in csv/json property that will encode bar height
        if (_ === 'undefined') return _barHeight;
        _barHeight = _;
        return this;
    };

    exports.xAxis = function(_) {
        // _ expects a string ===> accessor to column in csv/json property that will encode x Axis
        if (_ === 'undefined') return _xAxis;
        _xAxis = _;
        return this;
    };

    exports.yScale = function(_) {
        // _ expects a string ===> accessor to column in csv/json property that will encode y Axis
        if (_ === 'undefined') return _yScale;
        _yScale = _;
        return this;
    };

    exports.axisOpacity = function(_) {
        // _ expects [0-1] int/float value
        if (_ === 'undefined') return _axisOpacity;
        _axisOpacity = _;
        return this;
    };

    exports.margin = function(_) {
        // _ expects a object with t,r,b,l properties
        if (_ === 'undefined') return _margin;
        _margin = _;
        return this;
    };

    exports.barColor = function(_) {
        // _ expects a string
        if (_ === 'undefined') return _barColor;
        _barColor = _;
        return this;
    }

    // returning of module
    return exports;
}

// exporting factory function as default
export default BarChart;
