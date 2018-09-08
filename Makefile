.PHONY: help

help:
	@echo "make site    : rebuild docs/ from src/"

site:
	./build.sh src docs
