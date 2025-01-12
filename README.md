# Reservation Management System

## Description
This project is a RESTful API that allows users to manage spaces and reservations. It includes JWT authentication, Docker containers, and a reverse proxy with Nginx.

---

## Technologies Used
- **Node.js**: For the backend.
- **Express**: Framework for building the API.
- **MongoDB**: Database to persist users, spaces, and reservations.
- **JWT**: Token-based authentication.
- **Nginx**: Reverse proxy to handle HTTP traffic.
- **Docker**: Containerization of the backend, database, and proxy.
- **Swagger**: Documentation of the API.
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

2. Change the following variables in the docker-compose files:
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
    >**Note:** if you use the dev option when restarting the container the changes on the app folder will be reflected

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
  - **Description:** Return a list with al the users from the DB.

#### User Delete
- **DELETE/users/delete**
  - **Description:** Delete an user from the DB.

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
