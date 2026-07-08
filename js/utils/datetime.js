'use strict';

const pad2 = (n) => String(n).padStart(2, '0');

/*
 * Only the largest unit present in the output is left unwrapped (it
 * absorbs everything above it); every subordinate unit wraps modulo the
 * unit above it. Matches how Luxon's toFormat expresses a duration in
 * exactly the units named in the format string.
 */
const formatWholeSeconds = (total, { hours = false, days = false } = {}) => {
    if (days && total >= 86400) {
        const d = Math.floor(total / 86400);
        const h = Math.floor((total % 86400) / 3600);
        const m = Math.floor((total % 3600) / 60);
        const s = total % 60;
        return `${d} day${d === 1 ? '' : 's'}, ${h}:${pad2(m)}:${pad2(s)}`;
    }
    if (hours) {
        const h = Math.floor(total / 3600);
        const m = Math.floor((total % 3600) / 60);
        const s = total % 60;
        return `${h}:${pad2(m)}:${pad2(s)}`;
    }
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${pad2(s)}`;
};

export const dateTime = {
    secs2mmss: (secs, add_ms = false) => {
        const whole = Math.floor(secs);
        let out = formatWholeSeconds(whole, { hours: whole >= 3600, days: true });
        if (add_ms) {
            out += `.${Math.floor((secs - whole) * 10 + 1e-9)}`;
        }
        return out;
    },

    mmss2secs: (mmss) => {
        const [ m, s ] = mmss.split(':');
        return +m * 60 + +s;
    },

    ds2mmss: (ds, add_ms = true) => {
        const wholeSecs = Math.trunc(ds / 10);
        let out = formatWholeSeconds(wholeSecs, { hours: ds > 36000, days: false });
        if (add_ms) {
            out += `.${Math.abs(ds % 10)}`;
        }
        return out;
    },
};
