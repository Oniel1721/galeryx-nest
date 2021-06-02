import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create.dto';
import { User } from './interfaces/User';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(private userService:UserService){}

    @Get()
    getUsers():Promise<User[] | {}>{
        return this.userService.getUsers()
    }

    @Get(':name')
    getUser(@Param('name') name):Promise<User | {}>{
        return this.userService.getUser(name)
    }

    @Post('create')
    createUser(@Body() createUserDto:CreateUserDto):Promise<User | {}>{
        return this.userService.createUser(createUserDto)
    }

    @Post()
    loginUser(@Body() createUserDto:CreateUserDto):Promise<User | {}>{
        return this.userService.loginUser(createUserDto)
    }


    @Delete(':name')
    deleteUser(@Param('name') name:string, @Body() data:{password}): Promise<{}>{
        return this.userService.deleteUser(name, data.password)
    }
}
