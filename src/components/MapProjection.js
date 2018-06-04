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
    let _footer = {caption:'some caption text here', credit:'credit', source:'data source'};

    function exports(data,projection) {
        // selecting root element ==> chart container, div where function is called in index.js
        const root = _;
        const container = d3.select(root);

        // declaring setup/layout variables
        const width = root.clientWidth;
        const height = root.clientHeight;
        const margin = {t:20, r:20, b:20, l:50};
        const w = width - (margin.r + margin.l);
        const h = height - (margin.t + margin.b);

        // setting up geo projection
        const mapProjection = d3.geoAlbersUsa()
            .scale(height*1.8)
            .translate([(w/2),h/2]);

        const path = d3.geoPath()
                      .projection(mapProjection);

        // setting up scale
        const scaleSize = d3.scalePow()
            .domain([0,d3.max(data, d => d.amount)])
            .range([5,25]);


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
            .attr('r', d => scaleSize(d.amount))
            .attr('fill','purple')
            .attr("fill-opacity", 0.6);

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
		// _ is an object { title: , sub: }
		if (typeof _ === "undefined") return _header
		_header = _;
		return this
	}
    exports.footer = function(_) {
		// _ is an object { credit: , source: }
		if (typeof _ === "undefined") return _footer
		_footer = _;
		return this
	}

    exports.on = function(eventType, cb) {
        // eventType is a string
		// cb is a function
		// _dispatch.on(eventType, cb);
		return this;
    }

    // returning of module
    return exports;
}

// exporting factory function as default
export default MapProjection;
