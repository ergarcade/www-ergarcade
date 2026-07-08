---
title: "BikeErg Raw Data Capture"
description: "Capturing and analysing raw ErgData stroke data across BikeErg damper settings."
tagline: "Through the [ErgData](https://concept2.com/ergdata) application, it's possible to record and review stroke / revolution data from a Concept2 ergometer. Below we capture and analyse pieces performed on the BikeErg at different damper settings."
chartScript: "/js/charts/bikeerg-damper-tests.js"
weight: 2
---

## Aim

We want to see the effect that damper setting has on pace at a given RPM
on the BikeErg. An in-depth discussion of damper setting and drag factor
is beyond the scope of this experiment; Concept2 has an excellent [article
describing what damper is, what drag factor is, what they are not, and what damper to use](https://www.concept2.com/indoor-rowers/training/tips-and-general-info/damper-setting-101).

## Method

Starting at damper 10, 2:00 of work would be completed on the BikeErg
and recorded by ErgData. The athlete would try to get as high an RPM as
possible over the 2:00, but not hold any particular RPM. This allows us
to accumulate data mapping RPM to pace over a range at a given damper.

This would be done 10 times; the first at damper 10, the second at
damper 9 and so on until damper 1.

## Setup

- The BikeErg used was less than a year old.
- The flywheel cage was clean before starting the experiment.
- At damper 10, the BikeErg Performance Monitor (PM) showed a drag factor of 220.
- At damper 1, the PM showed a drag factor of 49.
- Data recorded at 13m above sea level.
- Two athletes alternated between work pieces.
- Each work piece was recorded by ErgData and uploaded to the [Concept2 logbook](https://log.concept2.com).

## Results

Each work piece was pulled from the Concept2 logbook, along with
per-stroke (per-revolution) data. Raw data is available [here](/js/charts/bikeerg-damper-tests.js). Erroneously
recorded values (value too high, recorded pace invalid with associated
RPM etc) are commented out of the dataset.

Each damper setting graph series in each graph below is labeled
*D&lt;num&gt;*, where *&lt;num&gt;* is the number the damper
was set on.

Tap each series label in each graph's legend to disable / enable the
series on the graph. Mouse-over or tap the graph to see values of pace
for each damper at a given RPM.

{{< chart "Raw data, cleaned" "The raw data was cleaned, with repeated pace/RPM values aggregated to a single data point to remove noise." "graph-bikeerg-damper-tests-cleaned" >}}

At this point, it is possible to infer the trajectories of RPM-pace pairs resembling curves.

{{< chart "Joining the dots" "Plotting each series as a line reveals a non-linear relationship between pace and RPM." "graph-bikeerg-damper-tests-connected" >}}

We can also see that a higher damper setting yields a faster pace at the same RPM for all recorded RPM. For example: at damper 1, an RPM of 80 gives a pace of 2:23.9. At damper 10, an RPM of 80 gives a pace of 1:28.0.

{{< chart "Averaging out" "A cumulative average across each dataset, reducing noise at the cost of accuracy." "graph-bikeerg-damper-tests-cumulative-average" >}}

Passing a cumulative average function across each dataset helps reduce
bumps, at the cost of reducing accuracy. However, this reinforces our
previous observation relating pace, RPM and damper.

## Summary

While our observation that a higher damper setting at a particular RPM
yields a faster pace is not revolutionary (no pun intended), it is
interesting to see the effect that damper has across a range of damper
settings.

Note that a dusty flywheel or air pressure changes due to altitude will
generate different values to the ones documented above.

## Flaws

### Collection method

The methodology of having the athlete cover a range of RPM for 2:00 was
flawed. Naturally, the athletes increased from idle to a
&ldquo;comfortable&rdquo; RPM over a short period of time, stayed at
that RPM, and then increased RPM nearing the end of the 2:00.

This gave a larger variance of pace at low and high RPM, which may skew
the results.

A better approach would be to select a set of RPM values (perhaps 30, 40,
50, 60, 70, 80) and have the athlete hold that RPM for a set amount of
time before moving to the next. This way we collect a greater number of
points at each known RPM, reducing jitter.

### Incorrect Drag Factor?

Drag factor should follow damper setting to some degree; a lower damper
setting is a lower drag factor, higher damper setting is a higher drag
factor. However, the test for damper 10 showed a drag factor lower
than damper 9, 8, and 7:

{{< chart "Drag factor by damper setting" "Damper 10 shows a lower drag factor than damper 9, 8 and 7." "graph-bikeerg-damper-tests-drag-factors" >}}

Unsure what happened here.

## Future work

It would be nice to re-run this and generate some more accurate data.
This would increase accuracy of our damper curves to allow better
comparisons between RPM and pace.

## Thanks

Special thanks to [@be.like.scott](https://instagram.com/be.like.scott)
and [@ktna89](https://instagram.com/ktna89) for the loan of
their BikeErg and help in running the tests.
