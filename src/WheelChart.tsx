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
    defaultColor: string;
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
    defaultColor: '#f6faff'
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
        return level > arcIndex  ? theme.selectedColor : theme.defaultColor;
    }

    useEffect(() => {
        const pie = d3.pie<IWheel>().value(1);

        const svg = d3.select(svgRef.current).append('g')
            .attr('transform', 'translate(' + svgWidth / 2 + ',' + svgHeight / 2 + ')');

        let tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any> | null = null;
        if (tooltipHtmlRenderer) {
            tooltip = useTooltip();
        }

        const arcsWrap = svg.selectAll('.arc')
            .data(pie(data))
            .enter();

        data.forEach(() => {
            let l = 0;
            while(l < levelsCount) {
                const arc = d3.arc<PieArcDatum<IWheel>>()
                    .innerRadius(l*levelHeight)
                    .outerRadius((1+l)*levelHeight);

                arcsWrap.append('path')
                    .attr('fill', function (d: PieArcDatum<IWheel>) {
                        return getArcBackground(d.data.level, l);
                    })
                    .attr('class', 'arc')
                    .attr('data-index', l)
                    .attr('stroke', theme.strokeColor)
                    .attr('d', arc)
                    .on('mouseover', (event, d: PieArcDatum <IWheel>) => {
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

                l++;
            }
        });

    }, [data]);

    return <svg ref={svgRef} width={svgWidth} height={svgHeight} />;
};

export default WheelChart;