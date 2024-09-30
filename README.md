# Area

![alt text](image.png)

## Building images 🐋

Most images will be built using the `-f` option.<br>
This will tell docker what file to use to compile.<br>
And by setting the directory to `.` (local-root), it allows us to re-create the 'mono-repo' effect, but with only the necessary application & the shared app.

### Api
```sh
docker build -t api -f apps/api/Dockerfile .
```

### Front-end
```sh
docker build -t api -f apps/frontend/Dockerfile .
```

### Queue
```sh
docker build -t queue apps/queue
```
See [the queue README page.](apps/queue/README.md)

### Task-manager
```sh
docker build -t manager -f apps/task_manager/Dockerfile .
docker run --env-file .env  --network=${port} manager
```
`port` is network name, it's "host" or "bridge" or else depending on your environment. For dev environment, it's "host". 

### Worker
```sh
docker build -t worker -f apps/worker/Dockerfile .
```