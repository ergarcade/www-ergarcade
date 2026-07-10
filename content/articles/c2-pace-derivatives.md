---
title: "Concept2 Pace Derivatives Chart"
description: "How pace, watts, speed and calories per hour relate on the RowErg, SkiErg and BikeErg."
tagline: "An easy way to compare pace, watts, speed and calories per hour on Concept2 ergometers."
chartScript: "/js/charts/c2.js"
thumbnail: "/images/articles/c2-pace.png"
weight: 1
aliases: ["/articles/c2-pace-derivatives.html"]
---

Concept2 ergometers display pace, watts, and calories per hour on the
performance monitor during a workout. The charts below display each of
these, as well as speed, to help in planning and performing your
workouts. Mouse over or tap to see metrics at a given pace.

{{< chart "Power" "Watts at a given pace." "graph-power" >}}
{{< chart "Speed" "Equivalent speed for BikeErg (1000m split) vs. RowErg/SkiErg (500m split)." "graph-speed" >}}
{{< chart "Calories per hour" "Estimated cal/hour for a 79.5kg individual at a given pace." "graph-calories" >}}

Below are descriptions of the terms and math involved in calculating
the various metrics in the charts above. Reading these is not necessary.

## Split

*Pace* is the time in seconds to cover a set distance &mdash; 500m for RowErg and SkiErg, 1000m for BikeErg. It is the basis for every other metric above.

{{< formula >}}split<sub>seconds</sub> = split distance<sub>metres</sub> &times; (work time<sub>seconds</sub> / work distance<sub>metres</sub>){{< /formula >}}

## Power

The monitor shows power (*P*) each stroke, measured in watts.

{{< formula >}}P<sub>watts</sub> = 2.8 / (split<sub>seconds</sub> / 500)<sup>3</sup>{{< /formula >}}

## Calories per hour

Roughly how many calories a 79.5kg individual would &ldquo;burn&rdquo; over an hour, based on power (*P*) and time (*t*). First, mechanical work (*W*) in kilojoules:

{{< formula >}}W<sub>kJ</sub> = (P<sub>watts</sub> &times; t<sub>seconds</sub>) / 1000{{< /formula >}}

Then calories per hour (*E*):

{{< formula >}}E<sub>cal/hour</sub> = (4 &times; W<sub>kJ</sub> + 0.35 &times; t<sub>seconds</sub>) / 4.2{{< /formula >}}

(See [The Physics of Ergometers, section 11](http://eodg.atm.ox.ac.uk/user/dudhia/rowing/physics/ergometer.html#section11) for information on the constants.)

## Speed

Speed is not shown by the monitor. It is calculated by scaling the pace across an entire hour, and is measured in kilometres per hour.

{{< formula >}}Speed<sub>kph</sub> = (split distance<sub>metres</sub> / pace<sub>seconds</sub>) &times; (3600 / 1000){{< /formula >}}

Note: speed is calculated and shown here to provide rough equivalency between Concept2 ergometers and other machines in terms of distance and time. This does not equate to *effort* or *energy expenditure*.

## Source

The above formulas and notes are summarised from original works by
Concept2 and Anu Dudhia. More detailed information can be found by
following the links below.

- [The Physics of Ergometers](http://eodg.atm.ox.ac.uk/user/dudhia/rowing/physics/ergometer.html)
- [Concept2 pace calculator](https://www.concept2.com/indoor-rowers/training/calculators/pace-calculator)
- [Concept2 calorie calculator](https://www.concept2.com/indoor-rowers/training/calculators/calorie-calculator)
- [Concept2 Indoor Rower Pace Chart](https://www.concept2.com/files/pdf/us/training/Training_PaceChart.pdf)
