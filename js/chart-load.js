'use strict';

const defaultGraphHeight = 250;

const getTheme = () => {
    const explicit = document.documentElement.getAttribute('data-theme');
    if (explicit === 'dark' || explicit === 'light') {
        return explicit;
    }
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : '';
};

const renderGraphs = (graphs, createAllGraphs) => {
    const theme = getTheme();

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
};

/*
 * graphs is an array of:
 *
 *      {
 *          div: 'name-of-div-on-page',
 *          options: optionsThatWePassDirectlyToECharts,
 *          [height: height of div]
 *      },
 */
export const graphLoader = (graphs, createAllGraphs = false) => {
    renderGraphs(graphs, createAllGraphs);

    window.addEventListener('resize', () => {
        setTimeout(() => {
            graphs.forEach((g) => {
                g.chart && g.chart.resize({ width: g.element.clientWidth });
            });
        }, 500);
    });

    /*
     * Re-render with the new theme when the light/dark toggle fires, since
     * ECharts themes are baked in at echarts.init() time.
     */
    document.addEventListener('themechange', () => renderGraphs(graphs, createAllGraphs));
};
