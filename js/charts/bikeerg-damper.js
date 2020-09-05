'use strict';

import { dateTime } from '/js/utils/datetime.js';
import { bikeerg_stableNumbers } from '/js/charts/bikeerg-damper-tests.js';

const damper = () => {
    const xAxis = [];
    const yAxis = [];
    const series = [];
    const dataset = [];
    const legend = [];
    const tooltip = [];

    legend.push({
        top: '10%',
        type: 'scroll',
    });

    tooltip.push({
        trigger: 'axis',
        formatter: (params) => {
            return params[0].value.spm + '<br />' + params.reduce((acc, val) => {
                return acc + `${val.marker} ${val.seriesName}: ${dateTime.ds2mmss(val.value.p)}<br />`;
            }, '');
        },
    });

    xAxis.push({
        type: 'value',
        name: 'spm',
        nameLocation: 'middle',
    });
    yAxis.push({
        type: 'value',
        name: 'pace',
        axisLabel: {
            formatter: (value) => dateTime.ds2mmss(value),
        },
        inverse: true,
    });

    bikeerg_stableNumbers.forEach((d, i) => {
        dataset.push({
            dimensions: [ 'spm', 'p' ],
            source: d.numbers,
        });

        series.push({
            type: 'line',
            name: `${d.damper}-${d.dragFactor}`,
            encode: {
                x: 'spm',
                y: 'p',
            },
            showSymbol: false,
            datasetIndex: i,
        });
    });

    return {
        legend,
        tooltip,
        xAxis,
        yAxis,
        series,
        dataset,
    };
};

export const bikeErg = {
    damper,
};
