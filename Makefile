-include user-make

all: clean build run

deploy:
	$(call USER_DEPLOY)

ifndef USER_DEPLOY
define USER_DEPLOY
	@echo ERROR: cannont deploy, because you have no deploy script
endef
endif

clean:
	@echo Cleaning project...
	@rm -rf ./js/*

build:
	@echo Building project...
	@tsc

run:
	@echo Running project...
	@npm run main

rebuild: clean build
	
watch:
	@echo Starting watch...
	@gulp watch