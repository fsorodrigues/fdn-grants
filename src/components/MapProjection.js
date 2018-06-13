// importing d3.js
import * as d3 from 'd3';

// importing modules
import {} from '../utils';

// importing stylesheets
// import '../style/timeseries.css';

// setting up modules

// setting up accessory factory function

// defining Factory function
function MapProjection(_) {

    // create getter-setter variables in factory scope
    let _header = {title:'Histogram title', sub:'subtitle'};
    let _footer = {caption:'some caption text here', credit:'credit'};
    let _margin = {t:20, r:5, b:20, l:35};
    let _mapRatio = 0.7;

    let _circleArea = 'amount';

    let _dispatch = d3.dispatch('circle:enter','circle:leave');

    function exports(data,projection) {
        // selecting root element ==> chart container, div where function is called in index.js
        const root = _;
        const container = d3.select(root);
        const tooltipClass = d3.select(root).attr('id').replace('figure','tooltip');
        const tooltip = d3.select(`.${tooltipClass}`);

        // declaring setup/layout variables
        const clientWidth = root.clientWidth;
        // const clientHeight = root.clientHeight;
        const getPadding = d3.select(root).style('padding').replace(/px/gi, '').split(' ');
        const padding = {t:+getPadding[0], r:+getPadding[1], b:+getPadding[0], l:+getPadding[1]};
        const width = clientWidth - (padding.r + padding.l);
        // const height = clientHeight - (padding.t + padding.b);
        const height = width * _mapRatio;
        const margin = _margin;
        const w = width - (margin.r + margin.l);
        const h = height - (margin.t + margin.b);
        // setting up geo projection
        const mapProjection = d3.geoAlbersUsa()
            .scale(width*1.25)
            .translate([(w/2),h/2]);

        const path = d3.geoPath()
                      .projection(mapProjection);

        // setting up scale
        const extentRadius = d3.extent(data, d => d[_circleArea]);
        const scaleSize = d3.scalePow()
            .exponent(0.5) // scale by circle area (square root scale)
            .domain(extentRadius)
            .range([width/250,width/30]);

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

        // appending svg to node
        // enter, exit, update pattern

        // update selection
        let svgUpdate = d3.select(root)
            .selectAll('.map-totals')
            .data([1]);
        // update selection
        const svgEnter = svgUpdate.enter()
            .append('svg')
            .classed('map-totals', true);
        // exit selection
        svgUpdate.exit().remove();
        // enter + update
        svgUpdate = svgUpdate.merge(svgEnter)
            .attr('width', width)
            .attr('height', height);

        // appending <g> to SVG
        const plot = svgUpdate.append('g')
            .classed('plot-map-totals',true)
            .attr('transform',`translate(${margin.l},${margin.t})`);

        const mapTile = plot.append('g')
            .classed('map-tile',true);

        const stateNodes = mapTile.selectAll('.state')
            .data(projection.features)
            .enter()
            .append('path')
            .attr('d', path)
            .classed('state',true)
            .attr('stroke', 'white')
            .attr('stroke-width', 1)
            .attr('fill', 'gainsboro');

        const circleTile = plot.append('g')
            .classed('circle-tile',true);

        const circleNodes = circleTile.selectAll('.circle-node')
            .data(data)
            .enter()
            .append('circle')
            .classed('circle-node', true)
            .attr('id', d => d.key)
            .attr('cx', d => mapProjection([d.lon,d.lat])[0])
            .attr('cy', d => mapProjection([d.lon,d.lat])[1])
            .attr('r', d => scaleSize(d[_circleArea]))
            .attr('fill','black')
            .attr("fill-opacity", 0.6)
            .on('mouseenter', function(d) {
                _dispatch.call('circle:enter',this,d,tooltip);
            })
            .on('mouseleave', function(d) {
                _dispatch.call('circle:leave',this,d,tooltip);
            });

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
		// _ is an object { title: , sub: }
		if (typeof _ === "undefined") return _header;
		_header = _;
		return this;
	};

    exports.footer = function(_) {
		// _ is an object { credit: , source: }
		if (typeof _ === "undefined") return _footer;
		_footer = _;
		return this;
	};

    exports.circleArea = function(_) {
		// _circleArea is a string
		if (typeof _ === "undefined") return _circleArea;
		_circleArea = _;
		return this;
	};

    exports.on = function(eventType,cb) {
        // eventType is a string ===> custom eventType
        // cb is a function ===> callback
        _dispatch.on(eventType,cb);
        return this;
    };

    // returning of module
    return exports;
}

// exporting factory function as default
export default MapProjection;
