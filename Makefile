PROJECT_NAME="vaccinator_backend"

COMPOSE=docker-compose --project-name=$(PROJECT_NAME) -f docker/docker-compose.yml
DEVCOMPOSE=$(COMPOSE) -f docker/docker-compose.dev.yml
PRODCOMPOSE=$(COMPOSE) -f docker/docker-compose.prod.yml

###############
# PRODCOMPOSE #
###############

.PHONY: produp
produp:
	$(PRODCOMPOSE) up

.PHONY: produpd
produpd:
	$(PRODCOMPOSE) up -d

.PHONY: proddown
proddown:
	$(PRODCOMPOSE) down

.PHONY: prodbuild
prodbuild:
	$(PRODCOMPOSE) build

.PHONY: prodrm
prodrm:
	$(PRODCOMPOSE) rm

##############
# DEVCOMPOSE #
##############

.PHONY: devup
devup:
	$(DEVCOMPOSE) up

.PHONY: devupd
devupd:
	$(DEVCOMPOSE) up -d

.PHONY: devdown
devdown:
	$(DEVCOMPOSE) down

.PHONY: devbuild
devbuild:
	$(DEVCOMPOSE) build

.PHONY: devupbuild
devupbuild:
	$(DEVCOMPOSE) up --build

.PHONY: devrm
devrm:
	$(DEVCOMPOSE) rm

#############
#   EXECs   #
#############

.PHONY: execbackend
exampleexec:
	docker exec -it vaccinator-backend sh
