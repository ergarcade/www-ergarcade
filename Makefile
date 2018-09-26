.PHONY: site clean css javascript images help

HTML_SRCS := $(wildcard ./src/webroot/*.html)
CSS_SRCS := $(wildcard ./src/webroot/css/*.css)
OTHER_SRCS := ./src/webroot/CNAME

HTML := $(patsubst ./src/webroot/%.html,./docs/%.html,$(HTML_SRCS))
CSS := $(patsubst ./src/webroot/css/%.css,./docs/css/%.css,$(CSS_SRCS))

MAPPINGS := src/direct-mappings.sed
SUBSTITUTES := src/file-subs.sed

./docs/%.html: ./src/webroot/%.html $(MAPPINGS) ./src/head.html ./src/foot.html
	sed -f $(SUBSTITUTES) ./$< | sed -f $(MAPPINGS) > $@

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

site: images javascript css docs/applications.html $(HTML) $(CSS)
	@cp -f $(OTHER_SRCS) ./docs

src/webroot/applications.html: src/webroot/app-manifest.txt
	./build_applications.sh $< > $@

docs/applications.html: src/webroot/applications.html
	sed -f $(SUBSTITUTES) ./$< | sed -f $(MAPPINGS) > $@

clean:
	@rm -rf docs/*.html docs/css/* docs/images/* docs/js/* docs/favicon.ico src/webroot/applications.html
	git checkout docs/
	rm -rf docs/products
	mkdir -p docs/products
