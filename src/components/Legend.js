// importing d3.js
import * as d3 from 'd3';

// importing accessory functions
import {formatMillionsMoney,powerTen,isMobile} from '../utils';

// importing stylesheets

// creating mobile test
const mobile = isMobile();

// defining Factory function
function Legend(_) {

    let _circleArea = 'amount';
    // let _circleColor = 'wc';
    let _margin = {t:0, r:0, b:0, l:0};
    let _circlesData = [50,100,150];
    let _title = ['Legend'];
    let _lineWidth = 0.5;
    let _powerOf10 = 6;

    function exports(data) {

        const root = this;
        const figureId = d3.select(root).attr('class').replace('legend','figure');
        const svgMap = d3.select(`#${figureId}`).select('svg').node();

        const clientWidth = root.clientWidth;
        const clientHeight = root.clientHeight;
        const getPadding = d3.select(root).style('padding').replace(/px/gi, '').split(' ');
        const padding = {t:+getPadding[0], r:+getPadding[0], b:+getPadding[0], l:+getPadding[0]};
        const width = clientWidth - (padding.r + padding.l);
        const height = clientHeight - (padding.t + padding.b);
        const margin = _margin;
        const w = width - (margin.r + margin.l);
        const h = height - (margin.t + margin.b);

        const svgHeight = svgMap.clientheight;
        const svgWidth = svgMap.clientWidth;

        // appending svg & plot
        // update selection
        let svg = d3.select(root)
            .selectAll('.legend-svg')
            .data([1]);
        // enter selection
        const svgEnter = svg.enter()
            .append('svg')
            .attr('height', height)
            .attr('width', width)
            .classed('legend-svg', true);
        // exit selection
        svg.exit().remove();
        // enter+update selection
        svg = svg.merge(svgEnter);
        // update selection
        let plotUpdate = svg.selectAll('.plot')
            .data([1]);
        // enter selection
        const plotEnter = plotUpdate.enter()
            .append('g')
            .classed('plot', true)
			.attr('transform',`translate(${margin.l},${margin.t})`);
        // exit selection
        plotUpdate.exit().remove();
        // enter+update selection
        plotUpdate = plotUpdate.merge(plotEnter);

        const extentRadius = d3.extent(data, d => d[_circleArea]); // min and max value in an array for r/area encoding property
        const scaleRadius = d3.scalePow()
            .exponent(0.5) // scale by circle area (square root scale)
            .domain(extentRadius)
            .range([svgWidth/250,svgWidth/30]);

        let sizeUpdate = plotUpdate.selectAll('.circle-size-legend')
            .data(_circlesData);
        const sizeEnter = sizeUpdate.enter()
            .append('circle');
        sizeUpdate.exit().remove();
        sizeUpdate = sizeUpdate.merge(sizeEnter)
            .classed('circle-size-legend',true)
            .attr('id', d => `circle-${d}`)
            .attr('stroke', 'black')
            .attr('stroke-width', _lineWidth)
            .attr('fill', 'none')
            .attr('r', d => scaleRadius(powerTen(d,_powerOf10)));

        let valuesUpdate = plotUpdate.selectAll('.circle-size-value')
            .data(_circlesData);
        const valuesEnter = valuesUpdate.enter()
            .append('text');
        valuesUpdate.exit().remove();
        valuesUpdate = valuesUpdate.merge(valuesEnter)
            .classed('circle-size-value',true)
            .attr('id', d => `value-${d}`)
            .attr('fill', 'black')
            .text(d => formatMillionsMoney(powerTen(d,_powerOf10)));

        let titleUpdate = plotUpdate.selectAll('.legend-title')
            .data(_title);
        const titleEnter = titleUpdate.enter()
            .append('text');
        titleUpdate.exit().remove();
        titleUpdate = titleUpdate.merge(titleEnter)
            .classed('legend-title',true)
            .attr('fill', 'black')
            .attr('y', 12)
            .attr('x', w/2)
            .style('text-anchor', 'middle')
            .text(d => d);

            if (mobile) {
                sizeUpdate.attr('cx', w/3)
                    .attr('cy', (d,i) => 50+(i*30));

                valuesUpdate.attr('x', w/2)
                    .attr('y', (d,i) => 55+(i*30));

            } else {
                sizeUpdate.attr('cy', h/3.5)
                    .attr('cx', (d,i) => 50+(i*55));

                valuesUpdate.attr('y', h/1.8)
                    .attr('x', (d,i) => 55+(i*55))
                    .style('text-anchor', 'middle');
            }

    }

    exports.circleArea = function(_) {
        // _ expects a string ===> accessor to column in csv/json property that will encode circle r/area
        if (_ === 'undefined') return _circleArea;
        _circleArea = _;
        return this;
    };

    exports.circlesData = function(_) {
        // _ expects an array of 3 ints
        if (_ === 'undefined') return _circlesData;
        _circlesData = _;
        return this;
    };

    exports.lineWidth = function(_) {
        // _ is an int/float
        if (_ === 'undefined') return _lineWidth;
        _lineWidth = _;
        return this;
    };

    exports.powerOf10 = function(_) {
        // _ is an int/float
        if (_ === 'undefined') return _powerOf10;
        _powerOf10 = _;
        return this;
    };

    exports.title = function(_) {
        // _ expects an array of a single string
        if (_ === 'undefined') return _title;
        _title = _;
        return this;
    };

    // exports.circleColor = function(_) {
    //     // _ expects a string ===> accessor to column in csv/json property that will encode circle r/area
    //     if (_ === 'undefined') return _circleColor;
    //     _circleColor = _;
    //     return this;
    // };

    exports.margin = function(_) {
        // _ is an object with t,r,b,l as properties
        if (_ === 'undefined') return _margin;
        _margin = _;
        return this;
    };

    return exports;
}

export default Legend;
