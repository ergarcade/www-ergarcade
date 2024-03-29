'use strict';

import { dateTime } from '/js/utils/datetime.js';
import { graphLoader } from '/js/chart-load.js';

/*
 * Generated by gen.js
 */
const generators = {
    ad6: {
        rpm: {
            speed: (x) => 0.475 * x + 0.58,
            power: (x) => 0.000666667 * Math.pow(x, 3) - 0.00464286 * Math.pow(x, 2) + 0.704762 * x + 0.0857143,
        },
        speed: {
            power: (x) => 0.00497944 * Math.pow(x, 3) + 0.0382844 * Math.pow(x, 2) + 0.636253 * x - 0.0926272, // (cubic)
        },
    },

    aab: {
        rpm: {
            speed: (x) => 0.616994 * x - 0.0295657,
            power: (x) => 0.00116038 * Math.pow(x, 3) + 0.000732513 * Math.pow(x, 2) + 0.582979 * x - 0.0466331, // (cubic)
        },
        speed: {
            power: (x) => 0.00492128 * Math.pow(x, 3) + 0.0024886 * Math.pow(x, 2) + 0.967059 * x - 0.0851045, // (cubic)
        },
    },

    echo: {
        rpm: {
            speed: (x) => 0.6 * x,
            power: (x) => 0.000989583 * Math.pow(x, 3) + 0.00232143 * Math.pow(x, 2) + 0.268452 * x - 0.0428571, // (cubic)
        },
        speed: {
            power: (x) => 0.0045814 * Math.pow(x, 3) + 0.00644841 * Math.pow(x, 2) + 0.447421 * x - 0.0428571, // (cubic)
        },
    },

    bikeergDamper10: {
        rpm: {
            speed: (x) => 0.516636 * x - 0.304003,
            power: (x) => 0.127052 * Math.pow(x, 2) - 3.76672 * x - 2.65556, // (quadratic)
            calhour: (x) => 0.435283 * Math.pow(x, 2) - 12.8844 * x + 289.661, // (quadratic)
        },
        speed: {
            power: (x) => 0.00625518 * Math.pow(x, 3) + 0.111909 * Math.pow(x, 2) - 3.22511 * x + 29.6213, // (cubic)
            calhour: (x) => 2.34469 * Math.pow(x, 2) - 68.8354 * x + 946.93, // (quadratic)
        },
    },

    bikeergDamper5: {
        rpm: {
            speed: (x) => 0.42235 * x - 0.347034,
            power: (x) => -0.000157327 * Math.pow(x, 3) + 0.12073 * Math.pow(x, 2) - 5.97022 * x + 79.8918, // (cubic)
            calhour: (x) => 0.297865 * Math.pow(x, 2) - 12.5112 * x + 400.216, // (quadratic)
        },
        speed: {
            power: (x) => 0.00915041 * Math.pow(x, 3) - 0.141185 * Math.pow(x, 2) + 3.85559 * x - 33.9413, // (cubic)
            calhour: (x) => 0.0318684 * Math.pow(x, 3) - 0.529507 * Math.pow(x, 2) + 14.5516 * x + 170.821, // (cubic)
        },
    },

    bikeergDamper1: {
        rpm: {
            speed: (x) => 0.309206 * x + 0.211111,
            power: (x) => 0.0000833333 * Math.pow(x, 3) + 0.0260714 * Math.pow(x, 2) - 1.5119 * x + 28.2143, // (cubic)
            calhour: (x) => 0.14881 * Math.pow(x, 2) - 9.09762 * x + 477.286, // (quadratic)
        },
        speed: {
            power: (x) => 0.00747187 * Math.pow(x, 3) + 0.00210556 * Math.pow(x, 2) - 0.0125891 * x - 1.11492, // (cubic)
            calhour: (x) => 1.66999 * Math.pow(x, 2) - 34.3443 * x + 519.084, // (quadratic)
        },
    }
};

const vs = (dims, apparatus, options) => {
    const xAxis = [];
    const yAxis = [];
    const dataset = [];
    const series = [];
    const legend = [];
    const tooltip = [];
    const dataZoom = [];
    const title = [];

    const label = (v) => {
        switch (v) {
            case 'ad6': return 'AirDyne6';
            case 'aab': return 'Assault Air Bike';
            case 'echo': return 'Echo Bike';
            case 'bikeergDamper10': return 'BikeErg D10';
            case 'bikeergDamper5': return 'BikeErg D5';
            case 'bikeergDamper1': return 'BikeErg D1';

            case 'speed': return 'Speed';
            case 'rpm': return 'RPM';
            case 'power': return 'Power';
            case 'calhour': return 'cal/hr';
        };
    };

    const units = (k, v, trim = false) => {
        switch (k) {
            case 'speed': return `${v.toFixed(trim ? 0 : 1)}km/h\n(${v ? dateTime.secs2mmss(3600/v) : 0})`;
            case 'rpm': return `${v.toFixed()}rpm`;
            case 'power': return `${v.toFixed()}W`;
            case 'calhour': return trim ? `${(v / 1000).toFixed(1)}kcal/hr` : `${v.toFixed()}cal/hr`;
        };
    };

    legend.push({
        top: '10%',
        type: 'scroll',
    });

    title.push({
        left: 'middle',
        textAlign: 'middle',
        text: label(dims[0]) + ' vs ' + label(dims[1]),
    });

    tooltip.push({
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                show: true,
                formatter: (params) => units(params.axisDimension === 'x' ? dims[0] : dims[1], +params.value),
            },
        },
        formatter: (params) => {
            params.sort((a, b) => a.value[dims[1]] < b.value[dims[1]] ? 1 : a.value[dims[1]] > b.value[dims[1]] ? -1 : 0);

            return units(dims[0], params[0].value[dims[0]]) + '<br />' + params.reduce((acc, val) => {
                if (!val.value[dims[1]]) {
                    return acc;
                }

                return acc + `${val.marker} ${units(dims[1], val.value[dims[1]])} ${val.seriesName}<br />`;
            }, '');
        },
    });

    xAxis.push({
        name: label(dims[0]),
        nameLocation: 'middle',
        nameGap: 30,
        axisLabel: {
            formatter: (value) => units(dims[0], +value, true),
        },
        min: options.min,
        max: options.max,
    });
    yAxis.push({
        nameLocation: 'middle',
        nameGap: 50,
        axisLabel: {
            formatter: (value) => units(dims[1], +value, true),
        },
        min: 'dataMin',
        max: 'dataMax',
    });

    dataZoom.push({
        type: 'slider',
        xAxisIndex: 0,
        labelFormatter: (value) => units(dims[0], +value),
    },{
        type: 'slider',
        yAxisIndex: 0,
        labelFormatter: (value) => units(dims[1], +value),
        right: '3%',
    });

    apparatus.forEach((a, i) => {
        const generator = generators[a][dims[0]][dims[1]];

        const gen = (f, o) => {
            const data = [];

            if (f) {
                for (let i = o.min; i <= o.max; i += o.step) {
                    const foo = {};
                    foo[dims[0]] = i;
                    foo[dims[1]] = f(i);
                    data.push(foo);
                }
            }
            return data;
        };

        dataset.push({
            dimensions: [ dims[0], dims[1] ],
            source: gen(generator, options),
        });

        series.push({
            type: 'line',
            name: label(a),
            encode: {
                x: dims[0],
                y: dims[1],
            },
            datasetIndex: i,
            symbolSize: 2,
            connectNulls: true,
        });
    });

    return {
        xAxis,
        yAxis,
        dataset,
        series,
        legend,
        title,
        tooltip,
        //dataZoom,
    };
};

const apparatus = Object.keys(generators);
const options = {
    speed: { min: 10, max: 50, step: 1, },
    rpm: { min: 30, max: 100, step: 1, },
};

const airbike = {
    RPMVsSpeed: () => vs([ 'rpm', 'speed' ], apparatus, options['rpm']),
    RPMVsPower: () => vs([ 'rpm', 'power' ], apparatus, options['rpm']),
    RPMVsCalHour: () => vs([ 'rpm', 'calhour' ], apparatus, options['rpm']),
    speedVsPower: () => vs([ 'speed', 'power' ], apparatus, options['speed']),
    speedVsCalHour: () => vs([ 'speed', 'calhour' ], apparatus, options['speed']),
};

export const graphs = [
    { div: 'graph-rpm-vs-speed', options: airbike.RPMVsSpeed },
    { div: 'graph-rpm-vs-power', options: airbike.RPMVsPower },
    { div: 'graph-rpm-vs-calhour', options: airbike.speedVsPower },
];

document.addEventListener('DOMContentLoaded', () => {
    graphLoader(graphs);
});
