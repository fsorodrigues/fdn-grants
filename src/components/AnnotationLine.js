// importing d3.js
import * as d3 from 'd3';

// importing accessory functions

// importing stylesheets
// import '../style/axis.css';

// defining Factory function
function AnnotationLine(_) {

    // create getter-setter variables in factory scope
    let _margin = {t:20, r:5, b:20, l:35};
    let _xAxis = 'year';
    let _yAxis = 'total';
    let _curve = d3.curveBasis;
    let _year = 2008;

    function exports(data) {

        // selecting root element ==> svg container, div where function is called in index.js
        const root = this;
        const svg = d3.select(root)
            .select('svg')
            .node();

        // declaring setup/layout variables
        const width = svg.clientWidth;
        const height = svg.clientHeight;
        const margin = _margin;
        const w = width - (margin.r + margin.l);
        const h = height - (margin.t + margin.b);

        let plot = d3.select(root).select('.plot')
            .selectAll('.plot-line')
            .data([1]);
        const plotEnter = plot.enter()
            .append('g');
        plot = plot.merge(plotEnter)
            .classed('plot-line',true);

        // Setting up scales
        const scaleX = d3.scaleLinear()
            .range([0,w])
            .domain(d3.extent(data, d => d[_xAxis]));
        const scaleY = d3.scaleLinear()
            .range([h,0])
            .domain([0,d3.max(data, d => d[_yAxis])]);

        // data transformation
        const line_data = [
            {year:_year, total:d3.max(data, d => d[_yAxis])},
            {year:_year, total:-1000}
        ];

        // set up line generator
        var line = d3.line()
            .x(d => scaleX(d[_xAxis]))
            .y(d => scaleY(d[_yAxis]))
            .curve(_curve);

        // appending line
        let annotationLineUpdate = plot.selectAll('.annotation-line')
            .data([line_data]);
        const annotationLineEnter = annotationLineUpdate.enter()
            .append('path');
        annotationLineUpdate = annotationLineUpdate.merge(annotationLineEnter)
            .classed('annotation-line', true)
            .attr('d', line)
            .style('stroke', 'black')
			.style('stroke-width', '0.5pt')
            .style('pointer-events','none');

    }

    // create getter-setter pattern for customization
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

    exports.year =  function(_) {
        // _ is an int
        if (_ === 'undefined') return _year;
        _year = _;
        return this;
    };

    exports.margin = function(_) {
        // _ is an object with t,r,b,l as properties
        if (_ === 'undefined') return _margin;
        _margin = _;
        return this;
    };

    // returning of module
    return exports;
}

// exporting factory function as default
export default AnnotationLine;
