.PHONY: site

HTML_SRCS := $(wildcard ./src/webroot/*.html)
CSS_SRCS := $(wildcard ./src/webroot/css/*.css)

HTML := $(patsubst ./src/webroot/%.html,./docs/%.html,$(HTML_SRCS))
CSS := $(patsubst ./src/webroot/css/%.css,./docs/css/%.css,$(CSS_SRCS))

MAPPINGS := src/direct-mappings.sed

./docs/%.html: ./src/webroot/%.html $(MAPPINGS) ./src/head.html ./src/foot.html
	cat src/head.html ./$< src/foot.html | sed -f $(MAPPINGS) > $@

./docs/css/%.css: ./src/webroot/css/%.css
	cp ./$< $@

help:
	@echo "make site: generate website docs/ from src/"

images:
	@echo "copying images"
	@mkdir -p ./docs/images
	@rm -f ./docs/images/*
	@cp -af ./src/webroot/images/* ./docs/images/
	@cp -af ./src/webroot/favicon.ico ./docs/

javascript:
	@echo "copying javascript"
	@mkdir -p ./docs/js
	@rm -f ./docs/js/*
	@cp -af ./src/webroot/js/* ./docs/js/

css:
	@mkdir -p ./docs/css

site: images javascript css $(HTML) $(CSS)
