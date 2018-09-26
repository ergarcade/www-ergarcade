#!/bin/bash

set -e

PROG=`basename $0`

if [ $# -ne 1 ]; then
    echo "usage: $PROG <manifest>" 1>&2
    exit 1
fi

#
# The products in our manifest are listed in order that they
# should appear. New products should be added to the manifest
# in date order.
#
# manifest layout is:
# <product directory> | <product title> | <category>[, <category> ...]
#

echo "%head%";
echo "<h1>Applications</h1>";
echo "<ul class=\"gallery\">";

PREVIOUS_NAME=""
PREVIOUS_PATH=""
LAST_PRODUCT=""

#cat $1 | while IFS='' read -r line || [[ -n "$line" ]]; do
while IFS='' read -r line || [[ -n "$line" ]]; do
    IFS='|' TOKENS=( $line )
    IFS=' ,' CATEGORIES=( ${TOKENS[2]} )

    # verify application description exists in src/products/<name>
    if [ ! -d src/products/${TOKENS[0]} ]; then
        echo "$PROG: can't find application description pages in src/products/${TOKENS[0]}" 1>&2
        continue;
    fi

    if [ ! -f src/products/${TOKENS[0]}/images/thumbnail.jpg ]; then
        echo "$PROG: can't find thumbnail for src/products/${TOKENS[0]}" 1>&2
        continue;
    fi

    # verify application exists in docs/applications/<name>
    if [ ! -d docs/applications/${TOKENS[0]} ]; then
        echo "$PROG: can't find application in docs/applications/${TOKENS[0]}" 1>&2
        continue;
    fi

    # add name, category (as a class) and thumbnail to applications.html
    echo "<li class=\"${CATEGORIES[*]}\"><a href=\"products/${TOKENS[0]}\"><img title=\"${TOKENS[1]}\" alt=\"${TOKENS[1]}\" src=\"products/${TOKENS[0]}/images/thumbnail.jpg\"><br />${TOKENS[1]}</a></li>"

    # Copy web description from source.
    rm -rf docs/products/${TOKENS[0]}
    cp -a src/products/${TOKENS[0]} docs/products

    # Expand our macros.
    # XXX Maybe not here - push back to makefile so we don't dupe this stuff.
	sed -i.bak -f src/file-subs.sed docs/products/${TOKENS[0]}/index.html && \
        sed -i.bak -f src/direct-mappings.sed docs/products/${TOKENS[0]}/index.html

    # Set the previous product.
    if [ ! -z "$PREVIOUS_NAME" ]; then
        sed -i.bak \
            -e "s#%previous-product%#<span class=\"left\">Back: <a href=\"${PREVIOUS_PATH}\">\&lt; ${PREVIOUS_NAME}</a></span>#g" \
            docs/products/${TOKENS[0]}/index.html
    else
        sed -i.bak -e "s#%previous-product%##g" docs/products/${TOKENS[0]}/index.html
    fi

    PREVIOUS_NAME=${TOKENS[1]};
    PREVIOUS_PATH="/products/${TOKENS[0]}";

    # Set the next product link, of the _last_ product we did.
    if [ ! -z "$LAST_PRODUCT" ]; then
        sed -i.bak \
            -e "s#%next-product%#<span class=\"right\">Next: <a href=\"/products/${TOKENS[0]}\">${TOKENS[1]} \&gt;</a></span>#g" \
            docs/products/${LAST_PRODUCT}/index.html
    fi

    LAST_PRODUCT=${TOKENS[0]}
done <<< "$(cat $1)"

sed -i.bak -e "s#%next-product%##g" docs/${PREVIOUS_PATH}/index.html

find docs -name "*.bak" -exec rm {} \;

echo "</ul>";
echo "%foot%"
