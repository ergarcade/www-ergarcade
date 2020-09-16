'use strict';

import { dateTime } from '/js/utils/datetime.js';
import { graphLoader } from '/js/chart-load.js';

const paceData = (pace = { low: 180, high: 60, step: 1 }) => {
    const data = [];

    for (let p = pace.low; p >= pace.high; p -= pace.step) {
        const Power = Math.trunc(2.8 / Math.pow(p / 500, 3));
        const dt = 1;

        const mechanicalWork = Power * dt / 1000;                         // kJ
        const E = ((4 * mechanicalWork + 0.35 * dt) / 4.2) * (3600 / dt); // cal/hour

        data.push({
            Pace: p,
            'Speed (BikeErg)': 3600 / p,            // bike split distance = 1000m
            'Speed (Rower, Ski)': 3600 / p / 2,     // rower, skierg split distance = 500m 
            Power,
            E: Math.trunc(E),
        });
    }

    return data;
};

const paceDerivatives = (curves = [], options = {}) => {
    const xAxis = [];
    const yAxis = [];
    const dataset = [];
    const series = [];
    const tooltip = [];
    const title = [];
    const legend = [];
    const grid = [];

    const dimLabel = (k, v, shorten = false) => {
        switch (k) {
            case 'Speed': return (shorten ? v.toFixed() : v.toFixed(1)) + 'km/h';
            case 'Speed (BikeErg)': return (shorten ? v.toFixed() : v.toFixed(1)) + 'km/h';
            case 'Speed (Rower, Ski)': return (shorten ? v.toFixed() : v.toFixed(1)) + 'km/h';
            case 'Pace': return dateTime.secs2mmss(v);
            case 'Power': return v + 'W';
            case 'E': return shorten ? v/1000 + 'kc/hour' : v + 'cals/hour';
        }
    };

    /* XXX ugh */
    grid.push({
        right: curves.length == 0 ? '20%' : '5%',
    });

    legend.push({
        top: '10%',
        type: 'scroll',
    });

    title.push({
        text: 'Concept2 pace derivatives',
        textAlign: 'center',
        left: 'middle',

        ...options.title
    });

    tooltip.push({
        trigger: 'axis',
        formatter: (params) => {
            return 'Pace ' + dimLabel('Pace', params[0].value['Pace']) + '<br />' +
                params.reduce((acc,p) => {
                return acc + `${p.marker} ${dimLabel(p.seriesName, p.value[p.seriesName])}<br />`;
            }, '');
        },
    });

    dataset.push({
        source: paceData(),
    });

    xAxis.push({
        type: 'value',
        name: 'Pace',
        nameGap: 30,
        nameLocation: 'middle',
        axisLabel: {
            formatter: (value) => dimLabel('Pace', value),
        },
        inverse: true,
        min: 'dataMin',
        max: 'dataMax',
    });

    if (curves.length == 0 || curves.includes('Power')) {
        yAxis.push({
            name: 'Power',
            nameLocation: 'middle',
            nameGap: 50,
            axisLabel: {
                formatter: (value) => dimLabel('Power', value),
            },
        });
        series.push({
            type: 'line',
            name: 'Power',
            encode: {
                x: 'Pace',
                y: 'Power',
            },
            yAxisIndex: yAxis.length-1,
        });
    }

    if (curves.length == 0 ||
            curves.includes('Speed (BikeErg)') ||
            curves.includes('Speed (Rower, Ski)')) {
        yAxis.push({
            position: 'right',
            splitLine: {
                show: false,
            },
            axisLabel: {
                formatter: (value) => dimLabel('Speed', value, true),
            },
            offset: 60,
        });
        series.push({
            type: 'line',
            name: 'Speed (BikeErg)',
            encode: {
                x: 'Pace',
                y: 'Speed (BikeErg)',
            },
            yAxisIndex: yAxis.length-1,
        });
        series.push({
            type: 'line',
            name: 'Speed (Rower, Ski)',
            encode: {
                x: 'Pace',
                y: 'Speed (Rower, Ski)',
            },
            yAxisIndex: yAxis.length-1,
        });
    }

    if (curves.length == 0 || curves.includes('E')) {
        yAxis.push({
            splitLine: {
                show: false,
            },
            axisLabel: {
                formatter: (value) => dimLabel('E', value, true),
            },
        });
        series.push({
            type: 'line',
            name: 'E',
            encode: {
                x: 'Pace',
                y: 'E',
            },
            xAxisIndex: 0,
            yAxisIndex: 2,
            datasetIndex: 0,
        });
    }

    series.forEach((s) => {
        s.symbolSize = 2;
        s.sampling = 'average';
        s.smooth = true;
    });

    return {
        title,
        legend,
        tooltip,
        xAxis,
        yAxis,
        dataset,
        series,
        grid,
    };
};

export const graphs = [
    { div: 'graph-c2-pace-derivatives', options: paceDerivatives },
    { div: 'graph-c2-power-curve', options: () => paceDerivatives(
        [ 'Power' ],
        {
            title: {
                text: 'Concept2 - derived power curve',
            },
        },
    )},
];

document.addEventListener('DOMContentLoaded', () => {
    graphLoader(graphs);
});
