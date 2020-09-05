'use strict';

import { bikeerg } from '/js/charts/bikeerg-damper-tests.js';

const defaultGraphHeight = 350;

const graphs = [
    { div: 'bikeerg-spm-pace-derived', options: bikeerg.spmPaceDerived, },
    { div: 'bikeerg-spm-pace-recorded', options: bikeerg.spmPaceRecorded, },
];

document.addEventListener('DOMContentLoaded', () => {
    let theme = '';
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        theme = 'dark';
    }

    graphs.forEach((g) => {
        g.element = document.getElementById(g.div);

        if (!g.element) {
            g.element = document.createElement('div');
            g.element.id = g.div;

            document.body.appendChild(g.element);
        }

        const options = g.options();
        console.log(options);

        g.chart = echarts.init(g.element, theme);
        g.chart.showLoading();
        g.chart.setOption(options);
        g.chart.hideLoading();

        if (g.height === undefined) {
            g.height = defaultGraphHeight;
        }

        if (g.chart.getHeight() != g.height) {
            g.element.style.height = g.height + 'px';
            g.chart.resize({ height: g.height });
        }
    });

    window.addEventListener('resize', () => {
        setTimeout(() => {
            const w = document.body.offsetWidth;
            graphs.forEach((g) => {
                g.chart && g.chart.resize({ width: w });
            });
        }, 500);
    });
});
