"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var d3 = require("d3");
require("./styles.css");
var defaultTheme = {
    strokeColor: '#d0e0fc',
    selectedColor: '#3366d6',
    defaultColor: '#f6faff'
};
var DEFAULTS;
(function (DEFAULTS) {
    DEFAULTS[DEFAULTS["LEVEL_HEIGHT"] = 20] = "LEVEL_HEIGHT";
    DEFAULTS[DEFAULTS["LEVELS_COUNT"] = 10] = "LEVELS_COUNT";
    DEFAULTS[DEFAULTS["TOOLTIP_SHIFT"] = 7] = "TOOLTIP_SHIFT";
})(DEFAULTS || (DEFAULTS = {}));
var WheelChart = function (_a) {
    var data = _a.data, onLevelClickHandler = _a.onLevelClickHandler, tooltipHtmlRenderer = _a.tooltipHtmlRenderer, dimensions = _a.dimensions, _b = _a.theme, theme = _b === void 0 ? defaultTheme : _b, _c = _a.levelHeight, levelHeight = _c === void 0 ? DEFAULTS.LEVEL_HEIGHT : _c, _d = _a.levelsCount, levelsCount = _d === void 0 ? DEFAULTS.LEVELS_COUNT : _d;
    var svgRef = (0, react_1.useRef)(null);
    var width = dimensions.width, height = dimensions.height, margin = dimensions.margin;
    var svgWidth = width + margin.left + margin.right;
    var svgHeight = height + margin.top + margin.bottom;
    function useTooltip() {
        var tooltip = d3.select('body').append('div').attr('class', 'wheel-tooltip');
        tooltip.style('opacity', 0);
        tooltip.style('left', '0px').style('top', '0px');
        return tooltip;
    }
    function getArcBackground(level, arcIndex) {
        return level > arcIndex ? theme.selectedColor : theme.defaultColor;
    }
    (0, react_1.useEffect)(function () {
        var pie = d3.pie().value(1);
        var svg = d3.select(svgRef.current).append('g')
            .attr('transform', 'translate(' + svgWidth / 2 + ',' + svgHeight / 2 + ')');
        var tooltip = null;
        if (tooltipHtmlRenderer) {
            tooltip = useTooltip();
        }
        var arcsWrap = svg.selectAll('.arc')
            .data(pie(data))
            .enter();
        data.forEach(function () {
            var l = 0;
            while (l < levelsCount) {
                var arc = d3.arc()
                    .innerRadius(l * levelHeight)
                    .outerRadius((1 + l) * levelHeight);
                arcsWrap.append('path')
                    .attr('fill', function (d) {
                    return getArcBackground(d.data.level, l);
                })
                    .attr('class', 'arc')
                    .attr('data-index', l)
                    .attr('stroke', theme.strokeColor)
                    .attr('d', arc)
                    .on('mouseover', function (event, d) {
                    if (tooltip && tooltipHtmlRenderer) {
                        var i = event.currentTarget.getAttribute('data-index');
                        tooltip.html(tooltipHtmlRenderer(d.data.level, +i + 1, d.data.name))
                            .style('left', (event.pageX + DEFAULTS.TOOLTIP_SHIFT) + 'px')
                            .style('top', (event.pageY + DEFAULTS.TOOLTIP_SHIFT) + 'px');
                        tooltip.style('opacity', .9);
                    }
                })
                    .on('mouseout', function () {
                    if (tooltip) {
                        tooltip.style('opacity', 0);
                        tooltip.style('left', '0px').style('top', '0px');
                    }
                })
                    .on('click', function (event, d) {
                    if (onLevelClickHandler) {
                        onLevelClickHandler(d.data.name, event.currentTarget.getAttribute('data-index'));
                    }
                });
                l++;
            }
        });
    }, [data]);
    return react_1.default.createElement("svg", { ref: svgRef, width: svgWidth, height: svgHeight });
};
exports.default = WheelChart;
//# sourceMappingURL=WheelChart.js.map