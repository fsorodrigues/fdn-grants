// importing d3.js
import * as d3 from 'd3';

// importing modules
import {} from '../utils';

// importing stylesheets

// setting up modules

// defining global variables

// defining Factory function
function Tooltip(_) {

    const _dispatch = d3.dispatch('year:enter','year:leave')
    // create getter-setter variables in factory scope

    function exports(data) {
        // selecting root element ==> chart container, div where function is called in index.js
        const root = this;
        // const svg = d3.select(root)
        //     .select('.stacked-area')
        //     .node();

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

        // setting up scales
        // list of years
        const years = data.map(d => +d.year);
        const scaleX = d3.scaleLinear()
            .range([0,w])
            .domain(d3.extent(years));
        const scaleY = d3.scaleLinear()
            .range([h,0])
            .domain([0,d3.max(totalsByYear, d => d.total)]);
        // const scaleColor = d3.scaleOrdinal(d3.schemeCategory20);

        const plot = d3.select(root)
            .select('.plot-stacked-area');

        let guidesUpdate = plot.selectAll('.guide-node')
            .data(totalsByYear);
        const guidesEnter = guidesUpdate.enter()
            .append('line');
        guidesUpdate = guidesUpdate.merge(guidesEnter)
            .attr('class', d => `guide-${d.year}`)
            .classed('guide-node',true)
            // .attr('transform', d => `translate(${scaleX(d.year)},${0})`)
            .attr('x1', d => scaleX(d.year))
            .attr('y1', d => -5)
            .attr('x2', d => scaleX(d.year))
            .attr('y2', d => h+2)
            .style('stroke', '#FF8C00')
            .style('stroke-width', 2)
            // .style('stroke-dasharray', '2px 4px')
            .style('opacity',0)
            .style('pointer-events', 'none');

        let linesUpdate = plot.selectAll('.year-node')
            .data(totalsByYear);
        const linesEnter = linesUpdate.enter()
            .append('line');
        linesUpdate = linesUpdate.merge(linesEnter)
            .classed('year-node',true)
            // .attr('transform', d => `translate(${scaleX(d.year)},${0})`)
            .attr('x1', d => scaleX(d.year))
            .attr('y1', d => 0)
            .attr('x2', d => scaleX(d.year))
            .attr('y2', d => h)
            .style('stroke', '#FF8C00')
            .style('stroke-width', 25)
            .style('opacity',0)
            .style('pointer-events', 'all')
            .on('mouseenter', function(d) {
                const svgContext = this.parentNode.parentNode;
                const filterData = data.filter(e => e.year == d.year);
                _dispatch.call('year:enter',this,svgContext,filterData);
            })
            .on('mouseleave', function(d) {
                const svgContext = this.parentNode.parentNode;
                const filterData = data.filter(e => e.year == d.year);
                _dispatch.call('year:leave',this,svgContext,filterData);
            });
    }

    // create getter-setter pattern for customization
    exports.on = function(eventType, cb) {
        // eventType is a string
		// cb is a function
		_dispatch.on(eventType, cb);
		return this;
    };

    // returning module
    return exports;
}

// exporting factory function as default
export default Tooltip;
