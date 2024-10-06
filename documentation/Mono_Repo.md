# Mono Repo

## Introduction

A mono repo is a single repository that contains all the code for multiple services of a project. This is in contrast to the more traditional approach of having a separate repository for each service. That means that each service is separated by being in a different directory rather than in differents repos.
**Epitech project are always in a single repo, how does our mono repo differ from that?**
We fully take advantage of the mono repo structure by having a shared app that contains all the shared code between the services. This allows us to have a single source of truth for all the shared code and to easily share code between the services. It also reduces the code duplication between the services and makes it easier to maintain the shared code.

## Structure

.
├── .github
├── apps
│   ├── api
│   ├── frontend
│   ├── mobileExpo
│   ├── queue
│   ├── shared
│   ├── task_manager
│   └── worker
├── devutils
├── documentation
└── mock_data

### .github

Contains the workflows (github actions) that are used to build and test the project.
- `deploy_to_gke.yml` is the workflow that is used to deploy the project to the Google Kubernetes Engine (GKE) cluster. It builds the images, pushes them to the Google Container Registry (GCR) and deploys the services to the GKE cluster.
- `push_to_mirror.yml` is the workflow that is used to push the project to the mirror repository. It pushes the project to the mirror repository when a push is made to the main repository.

### apps 

This directory contains all the services of the project. Each service is in a separate directory and contains all the code for that service. Because all of the services are written with Typescript, the build and run system is similar for every service.
We decided to simplify the commands by creating a `package.json` file at the root of the project that contains all the necessary scripts to build and run the services. The apps are ran by doing `npm run build:app <app_name>` and `npm run start:app <app_name>`. The `app_name` is the name of the directory of the service you want to run. For more information on the commands available, do `npm run`.

You can also use Docker to build and run the services. See more in the [Docker Guide](./Docker_Guide.md).

#### api

This is the service responsible for handling all the API requests. It uses the Express version of the NestJS framework to handle the requests and authentification. The connection to the MongoDB database is handled by using NestJS' Mongoose. The API is used by both the frontend and the mobileExpo services.

The routes, schemas and error codes are detailed in the swagger using the `/swagger-json` endpoint but also in [API Documentation](./README.md).

#### frontend

The frontend service is a SvleteJS application that is used to create, delete and monitor AREAs. It uses the API to authenticate and to send and receive data about the AREAs. The frontend is written for both desktop and mobile devices. For more details on how the frontend works, see the [Frontend Documentation](../apps/frontend/README.md).

#### mobileExpo

The mobileExpo is the Mobile port of the frontend. It is an Expo (a React Native wrapper) application that is used to create, delete and monitor AREAs. It uses the API to authenticate and to send and receive data about the AREAs. The mobileExpo is written for both Android and iOS devices.

#### queue

The queue service is only here to launch an RabbitMQ instance. It is used by the task_manager and worker services to communicate between each other. The task_manager passes AREAs as json messages to the queue and the worker listens to the queue to get the AREAs to process.

#### shared

This is the only app that is not a service by itself. Every service uses the shared app to share code between them. The shared app contains all the shared code between the services, such as the interfaces, the types, the error codes, the constants, the middlewares, the decorators, the services, the utils, etc. The shared app is a build step for every service and is not ran by itself. It can be built using the `npm run libs:build` command at the root of the project.

#### task_manager

The task_manager service is responsible for managing the tasks and sending them to the worker service. It uses the queue service to pass the AREAs as json messages to the queue. It reads the active AREAs from the database and sends them to the queue to be processed by the worker.

#### worker

The worker service is responsible for processing the tasks from the queue. It listens to the queue to get the AREAs to process. It processes the AREAs and updates the database with the results of the processing. The architecture of the project is designed so that if we launch multiple workers, they will process the AREAs in parallel. By using the Kubernetes cluster, we can easily scale the number of workers to process the AREAs faster.

### devutils

This directory contains all the development utilities that are used to help develop the project. It contains the scripts to build and run the services, the scripts to generate the documentation, the scripts to generate the mock data, etc.
Currently there are two scripts in the folder:
- `json-to-mongodb.js`, this scripts take a path to a json file and insert the date in the MongoDB database replacing the `_id` field by the actual ObjectId used by MongoDB.
- `update-readme.js` is a script that updates the README.md file at the root of the project by taking the content of the OpenAPI documentation from the API service, transforming and inserting it in the README.md file.

### documentation

- `Docker_Guide.md` contains the guide to build and run the services using Docker.
- `Mono_Repo.md` contains the guide to the mono repo structure.

### mock_data

This directory contains snippert of data that are used as a base to generate the mock data.

## Repo's Tips and Tricks:

- Put your `mongodb-ca.pem` file at the root of the repo, it is used to connect to the MongoDB database.
- Use the `npm run` command to see all the available commands.
- Take a look at the different `env.example` files in the services to see the environment variables that are used by the services.
- `.env` files should be at the root of the service directory, they are used to set the environment variables of the services.

