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
                    }
                }
            }
        },
        apis: ['./app/usersRoutes.js']
    };
    const rsmApiSpecification = swaggerJsdoc(options);
    app.use('/', swaggerUi.serve, swaggerUi.setup(rsmApiSpecification));
}