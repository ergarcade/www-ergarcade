.PHONY: deploy

HTML_SRCS := $(wildcard ./src/webroot/*.html)
CSS_SRCS := $(wildcard ./src/webroot/*.css)
HTML := $(patsubst ./src/webroot/%.html,./docs/%.html,$(HTML_SRCS))
CSS := $(patsubst ./src/webroot/%.css,./docs/%.css,$(CSS_SRCS))

MAPPINGS := src/direct-mappings.sed

./docs/%.html: ./src/webroot/%.html
	cat src/head.html ./$< src/foot.html | sed -f $(MAPPINGS) > $@

./docs/%.css: ./src/webroot/%.css
	cp ./$< $@

help:
	@echo "make deploy: generate website docs/ from src/"

deploy: $(HTML) $(CSS) $(MAPPINGS)
