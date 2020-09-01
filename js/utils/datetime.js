'use strict';

export const dateTime = {
    thisYear: () => luxon.DateTime.local().year,

    secs2mmss: (secs, add_ms = false) => {
        let format = 'm:ss';

        if (secs >= 86400) {
            format = 'd \'days,\' h:mm:ss';
        } else if (secs >= 3600) {
            format = 'h:mm:ss';
        }
        if (add_ms) {
            format += '.S';
        }
        return luxon.Duration.fromObject({ seconds: secs }).toFormat(format).replace(/\.([0-9]).*$/, '.$1');
    },

    mmss2secs: (mmss) => {
        const [ m, s ] = mmss.split(':');
        return +m * 60 + +s;
    },

    ds2mmss: (ds, add_ms = true, truncMs = true) => {
        const format = (ds > 36000 ? 'h:mm:ss' : 'm:ss') + (add_ms ? '.S' : '');
        const out = luxon.Duration.fromObject({ seconds: ds / 10 }).toFormat(format);

        return truncMs ? out.replace(/\.([0-9]).*$/, '.$1') : out;
    },
};
