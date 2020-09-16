'use strict';

const defaultGraphHeight = 250;

/*
 * graphs is an array of:
 *
 *      {
 *          div: 'name-of-div-on-page',
 *          options: optionsThatWePassDirectlyToECharts,
 *          [height: height of div]
 *      },
 */
export const graphLoader = (graphs, createAllGraphs = false, debug = false) => {
    let theme = '';
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        theme = 'dark';
    }

    graphs.forEach((g) => {
        g.element = document.getElementById(g.div);

        /*
         * If we must load all graphs, create any missing divs.
         */
        if (createAllGraphs && !g.element) {
            g.element = document.createElement('div');
            g.element.id = g.div;

            document.body.appendChild(g.element);
        }

        if (g.element) {
            /*
             * Remember to do this if we want to re-initialise everything on the
             * run for whatever reason (eg. light / dark mode change).
             */
            if (g.chart) {
                g.chart.dispose();
            }

            const options = g.options();
            if (debug) {
                console.log(options);
            }

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
        }
    });

    window.addEventListener('resize', () => {
        setTimeout(() => {
            graphs.forEach((g) => {
                g.chart && g.chart.resize({ width: g.element.clientWidth });
            });
        }, 500);
    });
};
