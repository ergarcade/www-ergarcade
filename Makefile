.PHONY: help serve build clean new-article

.DEFAULT_GOAL := help

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-14s\033[0m %s\n", $$1, $$2}'

serve: ## Run the local dev server with drafts and live reload
	hugo server -D

build: ## Production build into public/ (matches CI)
	hugo --minify

clean: ## Remove build artifacts
	rm -rf public resources .hugo_build.lock

new-article: ## Scaffold a new article, e.g. make new-article NAME=my-article-slug
	@test -n "$(NAME)" || (echo "Usage: make new-article NAME=my-article-slug" >&2; exit 1)
	hugo new content/articles/$(NAME).md
