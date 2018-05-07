.PHONY: deploy

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
	@echo "make deploy: generate website docs/ from src/"

images:
	@mkdir -p ./docs/images
	@rm -f ./docs/images/*
	cp -af ./src/webroot/images/* ./docs/images/

javascript:
	@mkdir -p ./docs/js
	@rm -f ./docs/js/*
	cp -af ./src/webroot/js/* ./docs/js/

deploy: images javascript $(HTML) $(CSS)
