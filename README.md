<img src="./ReservationManagementRESTfulAPI.logo.png" style="width: 90%; display: block; margin-left: auto; margin-right: auto; border-radius: 20px;">

## Reservation Management RESTful API

## Description
A robust RESTful API for managing spaces and reservations with secure JWT authentication. This system utilizes containerized environments with Docker and employs an Nginx reverse proxy for efficient traffic management.

---

## Technologies Used
- **Node.js 22.12.0**: For the backend.
- **Express ^4.21.2**: Framework for building the API.
- **MongoDB 8.0**: Database to persist users, spaces, and reservations.
- **JsonWebToken ^9.0.2**: Token-based authentication.
- **Nginx 1.27.3**: Reverse proxy to handle HTTP traffic.
- **Docker 27.4.1**: Containerization of the backend, database, and proxy.
- **SwaggerJsDoc ^6.2.8**: Documentation of the API.
- **SwaggerUIExpress ^5.0.1**: UI for the API documentation.
- **GitHub actions**: CI/CD deployment with azure

---

## Installation and Setup

### Prerequisites
- Docker Desktop. https://docs.docker.com/
- Git. https://git-scm.com/doc

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/AfsBackendDev/reservationManagementSystem.git
   cd reservationManagementSystem
   ```

2. Change the following variables in the docker-compose files in the root directory:
   ```yaml
    express_container:
        ports:
          - "your-desired-port:3000"
        environment:
        - SECRET_KEY=your-jwt-secret-key
        - MONGODB_URI=mongodb://your-db-user:your-db-password@mongodb_container:27017/myapp?authSource=admin
    mongodb_container:
        environment:
        - MONGO_INITDB_ROOT_USERNAME=your-db-user
        - MONGO_INITDB_ROOT_PASSWORD=your-db-password
   ```
   
3. Build and start the containers:
    
    **for production**
    ```bash
    docker compose up --build
    ```
    **for dev**
    ```bash
    docker compose -f docker-compose-dev.yaml up --build
    ```
    >**Note:** if you use the dev option changes on the app folder will be reflected when restarting the container

4. The API will be available at `http://localhost:your-desired-port`.

---

## Endpoints
>**Note:** You can see more detailed documentation of the API and perform tests at https://reservationManagementSystem.afsBackendDev.site or at http://127.0.0.1:your-desired-port/

### Authentication

#### User Registration
- **POST /users/register**
  **Description:** Creates a new user.

#### User Login
- **POST /users/login**
  **Description:** Authenticates the user and generates a JWT.

#### Users List
- **GET/users**
  **Description:** Return a list with all the users from the DB.

#### User Delete
- **DELETE/users/delete**
  **Description:** Delete a user from the DB.

### Space Management

#### Create Space
- **POST /spaces** *(JWT with admin role required)*
  **Description:** create a new space.

#### List Spaces
- **GET /spaces**
  **Description:** Returns a list of spaces.

#### Edit Space
- **PUT /spaces** *(JWT with admin role required)*
  **Description:** Edit a space.

#### Delete Space
- **DELETE /spaces** *(JWT with admin role required)*
  **Description:** Delete a space.

### Reservation Management

#### Create a Reservation
- **POST /reservations** *(JWT required)*
  **Description:** Create a new reservation.

#### List Reservations
- **GET /reservations** *(JWT required)*
  **Description:** Returns a list of reservations.
  >**Details:** this endpoint returns a list with all reservations if the user is administrator. If not, returns a list with the user reservations.

#### Edit a Reservation
- **PUT /reservations** *(JWT required)*
  **Description:** Edit a reservation.
  >**Details:** just the reservation holder or an administrator can edit reservations.

#### Delete a Reservation
- **DELETE /reservations** *(JWT required)*
  **Description:** Delete a reservation.
  >**Details:** just the reservation holder or an administrator can delete reservations.

---

## Project Structure
```
.
├── app
│   ├── db
│   │   ├── dbUtils.js
│   │   └── models.js
│   ├── routes
│   │   ├── reservationsRoutes.js
│   │   ├── spacesRoutes.js
│   │   └── usersRoutes.js
│   ├── tokens
│   │   └── tokenUtils.js
│   ├── docs.js
│   └── index.js
├── .dockerignore
├── .gitignore
├── docker-compose.yml
├── docker-compose-dev.yaml
├── Dockerfile
├── Dockerfile.dev
├── package-lock.md
├── package.json
└── README.md
```

---

## Testing
Use **Postman** or **Insomnia** to test the endpoints. You can also test the API using **Swagger** at `http://127.0.0.1:your-desired-port/`.

---

## Deployment

### Prerequisites
- virtual machine with the following dependencies.
  - **Docker Desktop**. https://docs.docker.com/
  - **Git**. https://git-scm.com/doc
  - **Password.pem**
    >**Note:** this file is used to connect to your vm. You can download it from your vm or create it in your vm and it is not necessary that the name be "Password.pem".

### Steps
1. Clone the repository in the VM:
   ```bash
   git clone https://github.com/AfsBackendDev/reservationManagementSystem.git
   cd reservationManagementSystem
   ```
2. Create and run the containers.
   ```bash
   docker compose up --build
   ```
3. The API will be available at `http://your-vm-public-ip:your-desired-port`.

>**Note:** you need to open your desired port on your vm or use nginx as a reverse proxy.

### Details
- #### CI/CD
  You can integrate github actions to automate the deployment process using the following file `rootDirectory/github/workflows/publish.yaml`
  **Steps**
    - Create a new repository in GitHub with the branch "main" as default.
    - Create a new secret called "MY_PEM_KEY" this secret will be the private key of your vm.
    - Create a new secret called "SSH_USER" this secret will be the user of your vm.
    - Create a new secret called "SSH_HOST" this secret will be the public ip of your vm.
    - Change the name of the repository at `rootDirectory/github/workflows/publish.yaml` in the line 34 for the name of your repository. For example
      ```bash
      cd your-new-repository-name/
      ```
    - Run the following commands in your vm with ssh.
      ```bash
      git clone https://github.com/your-new-repository-name.git
      ```
    - Now when you perform a push in your main branch the changes will be deployed automatically.
---

## License
This project is licensed under the GNU General Public License v3.0 - see the [LICENSE.md](LICENSE.md) file for details.

© 2025 Andrés Felipe Sarmiento Niño. All rights reserved.
