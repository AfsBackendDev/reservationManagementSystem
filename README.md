# Reservation Management System

## Description
This project is a RESTful API that allows users to manage spaces and reservations. It includes JWT authentication, Docker containers, and a reverse proxy with Nginx.

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
        - MONGODB_URI=mongodb://your-db-user:your-db-password@mongodb_container:27017/miapp?authSource=admin
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
    >**Note:** if you use the dev option changes on the app folder will be reflected when restarting the conatiner

4. The API will be available at `http://localhost:your-desired-port`.

---

## Endpoints
>**Note:** You can see more detailed documentation of the API and perform tests at reservationManagementSystem.afsBackendDev.site or at http://127.0.0.1:your-desired-port/

### Authentication

#### User Registration
- **POST /users/register**
  - **Description:** Creates a new user.

#### User Login
- **POST /users/login**
  - **Description:** Authenticates the user and generates a JWT.

#### Users List
- **GET/users**
  - **Description:** Return a list with all the users from the DB.

#### User Delete
- **DELETE/users/delete**
  - **Description:** Delete a user from the DB.

### Space Management

#### Create a Space
- **POST /spaces** *(JWT with admin role required)*
  - **Description:** create a new space.

#### List Spaces
- **GET /spaces**
  - **Description:** Returns a list of spaces.

#### Edit a Space
- **PUT /spaces** *(JWT with admin role required)*
  - **Description:** Edit a space.

#### Delete a Space
- **DELETE /spaces** *(JWT with admin role required)*
  - **Description:** Delete a space.

### Reservation Management

#### Create a Reservation
- **POST /reservations** *(JWT required)*
  - **Description:** Create a new reservation.

#### List Reservations
- **GET /reservations** *(JWT required)*
  - **Description:** Returns a list of reservations.
  >**Details:** this endpoint returns a list with all reservations if the user is administrator. If not, returns a list with the user reservations.

#### Edit a Reservation
- **PUT /reservations** *(JWT required)*
  - **Description:** Edit a reservation.
  >**Details:** just the reservation holder or an administrator can edit reservations.

#### Delete a Reservation
- **DELETE /reservations** *(JWT required)*
  - **Description:** Delete a reservation.
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

## License
This project is licensed under the MIT License.
