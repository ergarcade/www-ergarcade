'use strict';

const MVArotate = (data, subsetSize, field) => {
    const mva = [];
    let val = 0;

    /*
     * prime
     */
    for (let i = 0; i < subsetSize; i++) {
        val += data[i][field];
    }

    mva.push(data[subsetSize-1]);                   // save entire object
    mva[mva.length-1][field] = val / subsetSize;    // overwrite field

    /*
     * iterate
     */
    for (let i = subsetSize; i < data.length; i++) {
        const n = mva.push(data[i]);                        // save entire object
        mva[n-1][field] = mva[mva.length-1][field] +        // overwrite field
            (1 / subsetSize) * (data[i][field] - data[i-subsetSize][field]);
    }

    return mva;
};

const CMAappend = (data, subsetSize, field) => {
    const cma = [];

    /*
     * prime
     */
    cma.push(data[0]);

    /*
     * iterate
     */
    for (let i = 1; i < data.length; i++) {
        const val = (data[i][field] + (i * cma[cma.length-1][field])) / (i+1);
        const n = cma.push(data[i]);
        cma[n-1][field] = val;
    }

    return cma;
};

export const averaging = {
    MVArotate,
    CMAappend,
};
