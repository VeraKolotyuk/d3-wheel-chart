"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var d3 = __importStar(require("d3"));
require("./styles.css");
var defaultTheme = {
    strokeColor: '#d0e0fc',
    selectedColor: '#3366d6',
    bgColor: '#f6faff',
    labelsColor: '#232323FF',
    labelsSize: 17,
    labelsShift: 70
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
        return level > arcIndex ? theme.selectedColor : theme.bgColor;
    }
    function drawLabels(svg, pie) {
        var arcGenerator = d3.arc()
            .innerRadius(width / 2 + (theme.labelsShift ? theme.labelsShift : defaultTheme.labelsShift))
            .outerRadius(width / 2);
        svg.selectAll('slices')
            .data(pie(data))
            .enter()
            .append('text')
            .text(function (d) { return d.data.name; })
            .attr('transform', function (d) {
            return 'translate(' + arcGenerator.centroid(d) + ')';
        })
            .style('text-anchor', 'middle')
            .style('font-size', theme.labelsSize ? theme.labelsSize : defaultTheme.labelsSize)
            .style('fill', theme.labelsColor ? theme.labelsColor : defaultTheme.labelsColor);
    }
    function addEventHandlers(svg) {
        var tooltip = null;
        if (tooltipHtmlRenderer) {
            tooltip = useTooltip();
        }
        svg.on('mouseover', function (event, d) {
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
    }
    (0, react_1.useEffect)(function () {
        if (!data)
            return;
        var pie = d3.pie().value(1);
        var svg = d3.select(svgRef.current).append('g')
            .attr('transform', 'translate(' + svgWidth / 2 + ',' + svgHeight / 2 + ')');
        var arcsWrap = svg.selectAll('.arc')
            .data(pie(data))
            .enter();
        data.forEach(function () {
            var l = 0;
            while (l < levelsCount) {
                var arc = d3.arc()
                    .innerRadius(l * levelHeight)
                    .outerRadius((1 + l) * levelHeight);
                var arcs = arcsWrap.append('path')
                    .attr('fill', function (d) {
                    return getArcBackground(d.data.level, l);
                })
                    .attr('class', 'arc')
                    .attr('data-index', l)
                    .attr('stroke', theme.strokeColor)
                    .attr('d', arc);
                addEventHandlers(arcs);
                l++;
            }
        });
        drawLabels(svg, pie);
    }, [data]);
    return react_1.default.createElement("svg", { ref: svgRef, width: svgWidth, height: svgHeight });
};
exports.default = WheelChart;
//# sourceMappingURL=WheelChart.js.map