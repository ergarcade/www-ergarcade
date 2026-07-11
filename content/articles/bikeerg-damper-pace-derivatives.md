---
title: "BikeErg Damper and Pace Derivatives Charts"
description: "How the same RPM at different damper settings changes pace, power and cal/hr."
tagline: "On the BikeErg, the same RPM at different damper settings alters pace, power and calories per hour reported on the PM5. In this article we provide charts showing these relationships at damper settings 10, 8, 6, 4 and 2."
chartScript: "/js/charts/bikeerg-damper-pace-derivatives.js"
thumbnail: "/images/articles/bikeerg-damper.png"
date: "2026-07-08T15:49:44+10:00"
aliases: ["/articles/bikeerg-damper-pace-derivatives.html"]
---

Hover over or tap the graphs to see the values for each metric at damper
10, 8, 6, 4 and 2, at a certain RPM. Click or tap the legend markers to
hide or show different damper settings.

{{< chart "RPM vs Pace" "Pace at a given RPM, by damper setting." "graph-rpm-vs-speed" >}}
{{< chart "RPM vs Power" "Power at a given RPM, by damper setting." "graph-rpm-vs-power" >}}
{{< chart "RPM vs Cal/hour" "Calories per hour at a given RPM, by damper setting." "graph-rpm-vs-calhour" >}}

Below is a description of how the data for these charts was assembled.
Reading this is not necessary.

## Method

Starting at damper 10, 2:00 of work was completed on the BikeErg with
the athlete holding as close as possible to 30RPM. This was repeated for
40RPM, 50RPM and 60RPM.

This set of workouts was repeated at damper 8 and 6. It was also
repeated for dampers 4 and 2, but using 40RPM, 50RPM, 60RPM and 70RPM,
as 30RPM did not yield accurate paces.

## Setup

- The BikeErg used in testing was brand new.
- The BikeErg was calibrated prior to starting the workouts.
- The flywheel cage was clean before starting the workouts.
- At damper 10, the PM5 showed a drag factor of 215.
- At damper 1, the PM5 showed a drag factor of 37.
- Data recorded at 15m above sea level.
- Each work piece was recorded by ErgData and uploaded to the [Concept2 logbook](https://log.concept2.com).

## Collation

Each damper-rpm workout combination (eg. damper 10 RPM 30, damper 10 RPM
40 etc) was pulled from the Concept2 logbook, along with per stroke
(per-revolution) data. For each combination, any revolution not matching
the target RPM was removed, leaving only revolutions that matched our
target RPM. The average pace for each target RPM was calculated, giving a
damper-rpm-pace tuple.

Power and calories per hour were calculated based on the formulas for
[power from Concept2](https://www.concept2.com/indoor-rowers/training/calculators/watts-calculator) and
[indicated calories from the Physics of Ergometers](http://eodg.atm.ox.ac.uk/user/dudhia/rowing/physics/ergometer.html#section11) (these derivations were
[previously discussed here](/articles/c2-pace-derivatives/)):

| Damper | RPM | Pace | Power | Cal/hour |
|---|---|---|---|---|
| 10 | 30 | 3:43.7 | 31 | 406 |
| 10 | 40 | 2:50.4 | 70 | 540 |
| ... | ... | ... | ... | ... |

The [least-squares](https://en.wikipedia.org/wiki/Least_squares)
regression method was applied to each damper setting group of RPM-pace,
RPM-power and RPM-calories per hour combination to yield functions for
each, which are plotted in the charts at the top of this page.

## Caveats

The graphs presented above are based on results recorded on a single
machine (*n* = 1). Your may see different results on your own
BikeErg due to:

- Different amount of flywheel dust or debris which alters drag factor;
- Air pressure differences, notably from differing altitudes, again impacting drag factor;
- Differing amounts of wear on machines; or
- [Differing calibration](https://www.concept2.com/service/bikeerg/maintenance).
