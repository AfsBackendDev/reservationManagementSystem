import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import {app} from './index.js';

export function setDocs() {
    const options = {
        definition: {
            openapi: '3.0.0',
            info:{
                version: '1.0.0',
                title: 'Reservation Management System',
                description: 'Backend application that allow users to register, search for avaible spaces, make reservations and manage them'
            },
            tags:[
                {
                    name: '/users',
                    description: 'This endpoint manage al the information relationated with the users'
                },
                {
                    name: '/spaces',
                    description: 'This endpoint manage al the information relationated with the spaces'
                },
                {
                    name: '/reservations',
                    description: 'This endpoint manage al the information relationated with the spaces'
                }
            ],
            components:{
                responses:{
                    /*400*/badRequest:{
                        description: '(BadRequest) the data send is incorrect or there is mandatory data not sent'
                    },
                    /*401*/unauthorized:{
                        description: '(Unauthorized) some of the data sent is invalid'
                    },
                    /*404*/notFound:{
                        description: '(NotFound) the data send is not found on the DB'
                    },
                    /*500*/serverError:{
                        description: '(ServerError) something went wrong on the server'
                    }
                },
                parameters:{

                },
                schemas:{
                    userRegisterBody:{
                        type: 'object',
                        properties:{
                            first_name:{
                                type: 'string',
                                description: 'first name of the user'
                            },
                            second_name:{
                                type: 'string',
                                description: 'second name of the user'
                            },
                            first_last_name:{
                                type: 'string',
                                description: 'first last name of the user'
                            },
                            second_last_name:{
                                type: 'string',
                                description: 'second last name of the user'
                            },
                            email:{
                                type: 'string',
                                description: 'email of the user',
                                uniqueItems: true
                            },
                            password:{
                                type: 'string',
                                description: 'password of the user'
                            },
                            administrator:{
                                type: 'boolean',
                                description: 'if the user is an administrator'
                            }
                        }
                    },
                    userLoginBody:{
                        type: 'object',
                        properties:{
                            email:{
                                type: 'string',
                                description: 'email of the user'
                            },
                            password:{
                                type: 'string',
                                description: 'password of the user'
                            }
                        }
                    },
                    successUserLogin:{
                        type: 'object',
                        properties:{
                            token:{
                                type: 'string',
                                description: 'token of the user'
                            }
                        }
                    },
                    userDeleteBody:{
                        type: 'object',
                        properties:{
                            token:{
                                type: 'string',
                                description: 'token of the administrator user'
                            },
                            emailOfUserToDelete:{
                                type: 'string',
                                description: 'email of the user to delete'
                            }
                        }
                    },
                    spaceCreateBody:{
                        type: 'object',
                        properties:{
                            userToken:{
                                type: 'string',
                                description: 'token of the administrator user'
                            },
                            name:{
                                type: 'string',
                                description: 'name of the space'
                            },
                            description:{
                                type: 'string',
                                description: 'description of the space'
                            },
                            capacity:{
                                type: 'number',
                                description: 'capacity of the space'
                            }
                        }
                    },
                    spaceEditBody:{
                        type: 'object',
                        properties:{
                            userToken:{
                                type: 'string',
                                description: 'token of the administrator user'
                            },
                            spaceId:{
                                type: 'string',
                                description: 'id of the space'
                            },
                            name:{
                                type: 'string',
                                description: 'name of the space'
                            },
                            description:{
                                type: 'string',
                                description: 'description of the space'
                            },
                            capacity:{
                                type: 'number',
                                description: 'capacity of the space'
                            }
                        }
                    },
                    spaceDeleteBody:{
                        type: 'object',
                        properties:{
                            userToken:{
                                type: 'string',
                                description: 'token of the administrator user'
                            },
                            spaceId:{
                                type: 'string',
                                description: 'id of the space'
                            }
                        }
                    },
                    createReservationBody:{
                        type: 'object',
                        properties:{
                            userToken:{
                                type: 'string',
                                required: true
                            },
                            spaceName:{
                                type: 'string',
                                required: true
                            },
                            startDate:{
                                type: 'string',
                                default: 'YYYY-MM-DDTHH:mm',
                                required: true
                            },
                            endDate:{
                                type: 'string',
                                default: 'YYYY-MM-DDTHH:mm',
                                required: true
                            }
                        }
                    },
                    editReservationBody: {
                        type: 'object',
                        properties: {
                            userToken:{
                                type: 'string',
                                required: true
                            },
                            reservationId:{
                                type: 'string',
                                required: true
                            },
                            newStartDate:{
                                type: 'string',
                                default: 'YYYY-MM-DDTHH:mm',
                                required: true
                            },
                            newEndDate:{
                                type: 'string',
                                default: 'YYYY-MM-DDTHH:mm',
                                required: true
                            }
                        }
                    },
                    deleteReservationBody: {
                        type: 'object',
                        properties: {
                            userToken:{
                                type: 'string',
                                required: true
                            },
                            reservationId:{
                                type: 'string',
                                required: true
                            }
                        }
                    }
                }
            }
        },
        apis: ['./app/routes/usersRoutes.js', './app/routes/spacesRoutes.js', './app/routes/reservationsRoutes.js']
    };
    const rsmApiSpecification = swaggerJsdoc(options);
    app.use('/', swaggerUi.serve, swaggerUi.setup(rsmApiSpecification));
}