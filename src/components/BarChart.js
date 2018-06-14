// importing d3.js
import * as d3 from 'd3';

// importing accessory functions
import {formatMillionsMoney,formatPercent,stringify,isFirefox} from '../utils.js';

// importing stylesheets
import '../style/axis.css';

// defining global variables
const firefox = isFirefox();

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

    function exports(data) {

        // selecting root element ==> svg container, div where function is called in index.js
        const root = this;
        const container = d3.select(root);

        data.sort((a,b) => d3.descending(a[_barLength],b[_barLength]));

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

        // appending svg & <g> plot
        // update selection
        let plot = container.selectAll('.wrapper')
            .data([1]);
        // enter selection
        const plotEnter = plot.enter()
            .append('div');
        // exit selection
        plot.exit().remove();
        // enter+update selection
        plot = plot.merge(plotEnter)
            .classed('wrapper', true);

        // // Setting up scales
        // const scaleY = d3.scaleBand()
        //     .domain(data.map(d => d[_yAxis]))
        //     .range([0,h])
        //     .paddingInner(0.5)
        //     .round(true);
        //
        // const barHeight = scaleY.bandwidth();
        //
        const sumVolume = d3.sum(data,d => d.total);
        const maxVolume = d3.max(data, d => d[_xScale]);
        const scaleX = d3.scaleLinear()
            .domain([0, maxVolume])
            .range([0,w])
            .nice();

        // append rects to plot
        let binsUpdate = plot.selectAll('.sector-node')
            .data(data);
        const binsEnter = binsUpdate.enter()
            .append('div');
        binsUpdate.exit().remove();
        binsUpdate = binsUpdate.merge(binsEnter)
            .attr('class', d => `node-${stringify(d.sector)}`)
            .classed('sector-node', true);

        // append labels to plot
        let labelsUpdate = binsUpdate.selectAll('.label')
            .data(d => [d]);
        const labelsEnter = labelsUpdate.enter()
            .append('p');
        labelsUpdate.exit().remove();
        labelsUpdate = labelsUpdate.merge(labelsEnter)
            .attr('class', d => `label-${stringify(d.sector)}`)
            .classed('label', true)
            .text(d => d.sector);

        // append bar-node to plot
        let nodeUpdate = binsUpdate.selectAll('.bar-node')
            .data(d => [d]);
        const nodeEnter = nodeUpdate.enter()
            .append('div');
        nodeUpdate.exit().remove();
        nodeUpdate = nodeUpdate.merge(nodeEnter)
            .attr('class', d => `bar-node-${stringify(d.sector)}`)
            .classed('bar-node', true);

        // append bar-node to plot
        let barUpdate = nodeUpdate.selectAll('.bar')
            .data(d => [d]);
        const barEnter = barUpdate.enter()
            .append('div');
        barUpdate.exit().remove();
        barUpdate = barUpdate.merge(barEnter)
            .attr('class', d => `bar-${stringify(d.sector)}`)
            .classed('bar', true)
            .style('height', `32px`)
            .style('width', d => `${scaleX(d.total)}px`);

        // append values-node to bar-node
        let valuesUpdate = nodeUpdate.selectAll('.values-node')
            .data(d => [d]);
        const valuesEnter = valuesUpdate.enter()
            .append('div');
        valuesUpdate.exit().remove();
        valuesUpdate = valuesUpdate.merge(valuesEnter)
            .attr('class', d => `values-node-${stringify(d.sector)}`)
            .classed('values-node', true);

        // append total to value-node
        let totalsUpdate = valuesUpdate.selectAll('.total')
            .data(d => [d]);
        const totalsEnter = totalsUpdate.enter()
            .append('p');
        totalsUpdate.exit().remove();
        totalsUpdate = totalsUpdate.merge(totalsEnter)
            .attr('class', d => `total-${stringify(d.sector)}`)
            .classed('total', true)
            .text(d => formatMillionsMoney(d.total));

        // append percent to value-node
        let percentUpdate = valuesUpdate.selectAll('.percent')
            .data(d => [d]);
        const percentEnter = percentUpdate.enter()
            .append('p');
        percentUpdate.exit().remove();
        percentUpdate = percentUpdate.merge(percentEnter)
            .attr('class', d => `percent-${stringify(d.sector)}`)
            .classed('percent', true)
            .text(d => `(${formatPercent(d.total/sumVolume)})`);

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

    // returning of module
    return exports;
}

// exporting factory function as default
export default BarChart;
