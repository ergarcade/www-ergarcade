.PHONY: deploy

HTML_SRCS := $(wildcard ./src/webroot/*.html)
CSS_SRCS := $(wildcard ./src/webroot/css/*.css)
IMAGE_SRCS := $(wildcard ./src/webroot/images/*.jpg)

HTML := $(patsubst ./src/webroot/%.html,./docs/%.html,$(HTML_SRCS))
CSS := $(patsubst ./src/webroot/css/%.css,./docs/css/%.css,$(CSS_SRCS))
IMAGE := $(patsubst ./src/webroot/images/%.jpg,./docs/images/%.jpg,$(IMAGE_SRCS))

MAPPINGS := src/direct-mappings.sed

./docs/%.html: ./src/webroot/%.html
	cat src/head.html ./$< src/foot.html | sed -f $(MAPPINGS) > $@

./docs/css/%.css: ./src/webroot/css/%.css
	cp ./$< $@

help:
	@echo "make deploy: generate website docs/ from src/"

images:
	@cp -af ./src/webroot/images/* ./docs/images/

dirs:
	@mkdir -p ./docs/css
	@mkdir -p ./docs/images

deploy: dirs images $(HTML) $(CSS) $(MAPPINGS)
