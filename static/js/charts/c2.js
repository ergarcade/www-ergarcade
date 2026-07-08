'use strict';

import { dateTime } from '/js/utils/datetime.js';
import { graphLoader } from '/js/chart-load.js';

const pace = {          // in seconds
    low: 180,
    high: 60,
    step: 1,
};

const data = [];
for (let p = pace.low; p >= pace.high; p -= pace.step) {
    const Power = Math.trunc(2.8 / Math.pow(p / 500, 3));
    const dt = 1;

    const mechanicalWork = Power * dt / 1000;                          // kJ
    const E = ((4 * mechanicalWork + 0.35 * dt) / 4.2) * (3600 / dt);  // cal/hour

    data.push({
        Pace: p,
        'Speed (BikeErg)': 3600 / p,            // bike split distance = 1000m
        'Speed (Rower, Ski)': 3600 / p / 2,     // rower, skierg split distance = 500m
        Power,
        E: Math.trunc(E),
    });
}

const dimLabel = (k, v, shorten = false) => {
    switch (k) {
        case 'Speed (BikeErg)':
        case 'Speed (Rower, Ski)':
            return (shorten ? v.toFixed() : v.toFixed(1)) + 'km/h';
        case 'Pace': return dateTime.secs2mmss(v);
        case 'Power': return v + 'W';
        case 'E': return v + 'cals/hour';
    }
};

const paceXAxis = () => ({
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

const singleMetricTooltip = () => ({
    trigger: 'axis',
    formatter: (params) => {
        return 'Pace ' + dimLabel('Pace', params[0].value['Pace']) + '<br />' +
            params.reduce((acc, p) => {
                return acc + `${p.marker} ${dimLabel(p.seriesName, p.value[p.seriesName])}<br />`;
            }, '');
    },
});

const powerDerivatives = () => ({
    title: [{ text: 'Power', textAlign: 'center', left: 'middle' }],
    tooltip: [singleMetricTooltip()],
    dataset: [{ source: data }],
    xAxis: [paceXAxis()],
    yAxis: [{
        name: 'Power',
        nameLocation: 'middle',
        nameGap: 50,
        axisLabel: {
            formatter: (value) => value.toLocaleString() + 'W',
        },
    }],
    series: [{
        type: 'line',
        name: 'Power',
        encode: { x: 'Pace', y: 'Power' },
        symbolSize: 2,
        sampling: 'average',
        smooth: true,
    }],
});

const speedDerivatives = () => ({
    title: [{ text: 'Speed', textAlign: 'center', left: 'middle' }],
    legend: [{ top: '10%', type: 'scroll' }],
    tooltip: [singleMetricTooltip()],
    dataset: [{ source: data }],
    xAxis: [paceXAxis()],
    yAxis: [{
        name: 'km/h',
        nameLocation: 'middle',
        nameGap: 50,
        axisLabel: {
            formatter: (value) => dimLabel('Speed (BikeErg)', value, true),
        },
    }],
    series: [
        {
            type: 'line',
            name: 'Speed (BikeErg)',
            encode: { x: 'Pace', y: 'Speed (BikeErg)' },
            symbolSize: 2,
            sampling: 'average',
            smooth: true,
            endLabel: { show: true, formatter: '{a}' },
        },
        {
            type: 'line',
            name: 'Speed (Rower, Ski)',
            encode: { x: 'Pace', y: 'Speed (Rower, Ski)' },
            symbolSize: 2,
            sampling: 'average',
            smooth: true,
            endLabel: { show: true, formatter: '{a}' },
        },
    ],
});

const caloriesDerivatives = () => ({
    title: [{ text: 'Calories per hour', textAlign: 'center', left: 'middle' }],
    tooltip: [singleMetricTooltip()],
    dataset: [{ source: data }],
    xAxis: [paceXAxis()],
    yAxis: [{
        name: 'cal/hour',
        nameLocation: 'middle',
        nameGap: 50,
        axisLabel: {
            formatter: (value) => value.toLocaleString(),
        },
    }],
    series: [{
        type: 'line',
        name: 'E',
        encode: { x: 'Pace', y: 'E' },
        symbolSize: 2,
        sampling: 'average',
        smooth: true,
    }],
});

export const graphs = [
    { div: 'graph-power', options: powerDerivatives },
    { div: 'graph-speed', options: speedDerivatives },
    { div: 'graph-calories', options: caloriesDerivatives },
];

graphLoader(graphs);
