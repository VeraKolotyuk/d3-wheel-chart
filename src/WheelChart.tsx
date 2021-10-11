/**
 * Pie Chart where each section is split on given amount of levels.
 * Each level can be clickable and has tooltip on hover.
 */

import React, {useRef, useEffect} from 'react';
import * as d3 from 'd3';
import {PieArcDatum} from 'd3';
import './styles.css';

interface IWheel {
    name: string;
    level: number;
}

interface ITheme {
    strokeColor: string;
    selectedColor: string;
    bgColor: string;
    labelsColor?: string;
    labelsSize?: number;
    labelsShift?: number;
}

interface IMargin {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

export interface IDimensions {
    width: number;
    height: number;
    margin: IMargin;
}

type Props = {
    dimensions: IDimensions;
    data: IWheel[];
    levelHeight?: number;
    levelsCount?: number;
    theme?: ITheme;
    onLevelClickHandler?: (a: string, b: number) => void;
    tooltipHtmlRenderer?: (a: number, b: number, c: string) => string
}

const defaultTheme = {
    strokeColor: '#d0e0fc',
    selectedColor: '#3366d6',
    bgColor: '#f6faff',
    labelsColor: '#232323FF',
    labelsSize: 17,
    labelsShift: 70
};

enum DEFAULTS {
    LEVEL_HEIGHT = 20,
    LEVELS_COUNT = 10,
    TOOLTIP_SHIFT = 7,
}

const WheelChart = ({ data,
                        onLevelClickHandler,
                        tooltipHtmlRenderer,
                        dimensions,
                        theme = defaultTheme,
                        levelHeight = DEFAULTS.LEVEL_HEIGHT,
                        levelsCount = DEFAULTS.LEVELS_COUNT}: Props
) => {
    const svgRef = useRef(null);
    const { width, height, margin } = dimensions;
    const svgWidth = width + margin.left + margin.right;
    const svgHeight = height + margin.top + margin.bottom;

    function useTooltip() {
        const tooltip = d3.select('body').append('div').attr('class', 'wheel-tooltip');
        tooltip.style('opacity', 0);
        tooltip.style('left', '0px').style('top', '0px');
        return tooltip;
    }

    function getArcBackground(level: number, arcIndex: number) {
        return level > arcIndex  ? theme.selectedColor : theme.bgColor;
    }

    function drawLabels(svg: d3.Selection<SVGGElement, unknown, null, undefined>, pie:  d3.Pie<any, IWheel>) {
        const arcGenerator = d3.arc()
            .innerRadius(width/2 + (theme.labelsShift ? theme.labelsShift : defaultTheme.labelsShift))
            .outerRadius(width/2);
        svg.selectAll('slices')
            .data(pie(data))
            .enter()
            .append('text')
            .text(function(d: PieArcDatum<IWheel>){ return d.data.name; })
            .attr('transform', function(d:PieArcDatum<IWheel>) {
                return 'translate(' + arcGenerator.centroid(d as any) + ')';
            })
            .style('text-anchor', 'middle')
            .style('font-size',
                theme.labelsSize ? theme.labelsSize : defaultTheme.labelsSize)
            .style('fill',
                theme.labelsColor ? theme.labelsColor : defaultTheme.labelsColor);
    }

    function addEventHandlers(svg: d3.Selection<SVGPathElement, d3.PieArcDatum<IWheel>, SVGGElement, unknown>) {
        let tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any> | null = null;
        if (tooltipHtmlRenderer) {
            tooltip = useTooltip();
        }
        svg.on('mouseover', (event, d: PieArcDatum <IWheel>) => {
            if (tooltip && tooltipHtmlRenderer) {
                const i = event.currentTarget.getAttribute('data-index');
                tooltip.html(tooltipHtmlRenderer(d.data.level, +i+1, d.data.name))
                    .style('left', (event.pageX + DEFAULTS.TOOLTIP_SHIFT) + 'px')
                    .style('top', (event.pageY + DEFAULTS.TOOLTIP_SHIFT) + 'px');
                tooltip.style('opacity', .9);
            }
        })
            .on('mouseout', function() {
                if (tooltip) {
                    tooltip.style('opacity', 0);
                    tooltip.style('left', '0px').style('top', '0px');
                }
            })
            .on('click', (event, d: PieArcDatum <IWheel>) => {
                if (onLevelClickHandler) {
                    onLevelClickHandler(d.data.name, event.currentTarget.getAttribute('data-index'));
                }
            });
    }

    useEffect(() => {
        if (!data) return;
        const pie = d3.pie<IWheel>().value(1);

        const svg = d3.select(svgRef.current).append('g')
            .attr('transform', 'translate(' + svgWidth / 2 + ',' + svgHeight / 2 + ')');

        const arcsWrap = svg.selectAll('.arc')
            .data(pie(data))
            .enter();

        data.forEach(() => {
            let l = 0;
            while(l < levelsCount) {
                const arc = d3.arc<PieArcDatum<IWheel>>()
                    .innerRadius(l*levelHeight)
                    .outerRadius((1+l)*levelHeight);

                const arcs = arcsWrap.append('path')
                    .attr('fill', function (d: PieArcDatum<IWheel>) {
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

    return <svg ref={svgRef} width={svgWidth} height={svgHeight} />;
};

export default WheelChart;