'use strict';

import { dateTime } from '/js/utils/datetime.js';
import { graphLoader } from '/js/chart-load.js';

/*
0.00747187 * Math.pow(x, 3) + 0.00210556 * Math.pow(x, 2) - 0.0125891 * x - 1.11492
*/

const observedAAB = [
    { rpm: 20, speed: 12.3, power: 21, pace: null, },
    { rpm: 40, speed: 24.6, power: 99, pace: null, },
    { rpm: 60, speed: 37.0, power: 288, pace: null, },
    { rpm: 77, speed: 47.5, power: 579, pace: null, },
];

const derivedAAB = () => {
    const data = [];

    for (let x = 180; x >= 60; x -= 1) {
        const speed = 3600 / x;
        data.push({
            Pace: x,
            Power: Math.trunc(0.00492128 * Math.pow(speed, 3) + 0.0024886 * Math.pow(speed, 2) + 0.967059 * speed - 0.0851045),
        });
    }

    return data;
};

const derivedC2 = () => {
    const data = [];

    for (let x = 180; x >= 60; x -= 1) {
        data.push({
            Pace: x,
            Power: Math.trunc(2.8 / Math.pow(x / 500, 3)),
        });
    }

    return data;
};

const power = (curves = [], options = {}, useDerived = false) => {
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
            case 'Pace': return dateTime.secs2mmss(v);
            case 'Power': return v + 'W';
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
        text: 'Air Assault Bike',
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
        dimensions: [ 'Pace', 'Power' ],
        source: useDerived ? derivedAAB() : observedAAB.map((o) => {
                return {
                    Pace: o.speed > 0 ? 3600 / o.speed : 0,
                    Power: o.power,
                };
            }),
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
        min: dateTime.mmss2secs('5:00'),
        max: dateTime.mmss2secs('1:00'),

        ...options.xAxis
    });

    if (curves.includes('Power')) {
        yAxis.push({
            name: 'Power',
            nameLocation: 'middle',
            nameGap: 50,
            axisLabel: {
                formatter: (value) => dimLabel('Power', value),
            },

            ...options.yAxis
        });
        series.push({
            type: useDerived ? 'line' : 'scatter',
            name: 'Power',
            encode: {
                x: 'Pace',
                y: 'Power',
            },
            yAxisIndex: yAxis.length-1,
            symbolSize: useDerived ? 2 : 16,
        });
    }

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

const cmpAABC2PacePower = () => {
    const xAxis = [];
    const yAxis = [];
    const series = [];
    const dataset = [];
    const title = [];
    const grid = [];
    const legend = [];
    const tooltip = [];

    const dimLabel = (k, v, shorten = false) => {
        switch (k) {
            case 'Pace': return dateTime.secs2mmss(v);
            case 'Power': return v + 'W';
            case 'Concept2': return v + 'W Concept2';
            case 'Assault Air Bike': return v + 'W Assault Air Bike';
        }
        return k;
    };

    /* XXX ugh */
    grid.push({
        right: '5%',
    });

    legend.push({
        top: '10%',
        type: 'scroll',
    });

    title.push({
        text: 'Pace vs Power',
        textAlign: 'center',
        left: 'middle',
    });

    tooltip.push({
        trigger: 'axis',
        formatter: (params) => {
            return 'Pace ' + dimLabel('Pace', params[0].value['Pace']) + '<br />' +
                params.reduce((acc,p) => {
                return acc + `${p.marker} ${dimLabel(p.seriesName, p.value.Power)}<br />`;
            }, '');
        },
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
        min: dateTime.mmss2secs('3:00'),
        max: dateTime.mmss2secs('1:00'),
    });

    yAxis.push({
        name: 'Power',
        nameLocation: 'middle',
        nameGap: 50,
        axisLabel: {
            formatter: (value) => dimLabel('Power', value),
        },
    });

    [ 'Concept2', 'Assault Air Bike' ].forEach((erg) => {
        dataset.push({
            dimensions: [ 'Pace', 'Power' ],
            source: erg == 'Concept2' ? derivedC2() : derivedAAB(),
        });

        series.push({
            type: 'line',
            name: erg,
            encode: {
                x: 'Pace',
                y: 'Power',
            },
            symbolSize: 2,
            datasetIndex: dataset.length-1,
        });
    });

    return {
        xAxis,
        yAxis,
        series,
        dataset,
        title,
        grid,
        legend,
        tooltip,
    };
};

export const graphs = [
    {
        div: 'graph-aab-power-observed',
        options: () => power(
            [ 'Power' ],
            {
                title: {
                    text: 'Assault Air Bike - observed power curve',
                },
                xAxis: {
                    min: dateTime.mmss2secs('3:00'),
                    max: dateTime.mmss2secs('1:00'),
                },
                yAxis: {
                    min: 0,
                    max: 1800,
                },
            },
        )
    },
    {
        div: 'graph-aab-power-derived',
        options: () => power(
            [ 'Power' ],
            {
                title: {
                    text: 'Assault Air Bike - derived power curve',
                },
                xAxis: {
                    min: dateTime.mmss2secs('3:00'),
                    max: dateTime.mmss2secs('1:00'),
                },
                yAxis: {
                    min: 0,
                    max: 1800,
                },
            },
            true
        )
    },
    {
        div: 'graph-cmp-aab-c2-pace-power',
        options: cmpAABC2PacePower,
    },
];

document.addEventListener('DOMContentLoaded', () => {
    graphLoader(graphs, false);
});
