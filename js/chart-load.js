'use strict';

import { c2 } from '/js/charts/c2.js';

const defaultGraphHeight = 200;

const graphs = [ 
    { div: 'graph-c2-pace-derivatives', options: c2.paceDerivatives, height: 250 },
];

document.addEventListener('DOMContentLoaded', () => {
    let theme = '';
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        theme = 'dark';
    }

    graphs.forEach((g) => {
        g.element = document.getElementById(g.div);

        if (g.element) {
            /*
             * Remember to do this if we want to re-initialise everything on the
             * run for whatever reason (eg. light / dark mode change).
             */
            if (g.chart) {
                g.chart.dispose();
            }

            g.chart = echarts.init(g.element, theme);
            g.chart.showLoading();
            g.chart.setOption(g.options());
            g.chart.hideLoading();

            if (g.height === undefined) {
                g.height = defaultGraphHeight;
            }

            if (g.chart.getHeight() != g.height) {
                g.element.style.height = g.height + 'px';
                g.chart.resize({ height: g.height });
            }
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
