-include user-make

deploy:
	$(call USER_DEPLOY)

ifndef USER_DEPLOY
define USER_DEPLOY
	@echo ERROR: cannont deploy, because you have no deploy script
endef
endif

clean:
	gulp clean

build:
	gulp build

run:
	gulp run

rebuild: clean build
	
watch:
	gulp watch

all: clean build run