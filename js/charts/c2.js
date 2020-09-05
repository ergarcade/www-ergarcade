'use strict';

import { dateTime } from '/js/utils/datetime.js';

const paceDerivatives = () => {
    const xAxis = [];
    const yAxis = [];
    const dataset = [];
    const series = [];
    const tooltip = [];
    const title = [];
    const legend = [];
    const grid = [];

    const data = [];
    const pace = {          // in seconds
        low: 180,
        high: 60,
        step: 1,
    };
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

    grid.push({
        right: '20%',
    });

    legend.push({
        top: '10%',
    });

    title.push({
        text: 'Concept2 pace derivatives',
        textAlign: 'center',
        left: 'middle',
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
        source: data,
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
        animation: false,
        yAxisIndex: yAxis.length-1,
        showSymbol: false,
    });

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
        animation: false,
        yAxisIndex: yAxis.length-1,
        showSymbol: false,
    });
    series.push({
        type: 'line',
        name: 'Speed (Rower, Ski)',
        encode: {
            x: 'Pace',
            y: 'Speed (Rower, Ski)',
        },
        animation: false,
        yAxisIndex: yAxis.length-1,
        showSymbol: false,
    });

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
        animation: false,
        xAxisIndex: 0,
        yAxisIndex: 2,
        datasetIndex: 0,
        showSymbol: false,
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

export const c2 = {
    paceDerivatives,
};
