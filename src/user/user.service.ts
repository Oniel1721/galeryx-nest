import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from "@nestjs/jwt";
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt'

import { CreateUserDto } from './dto/create.dto';
import { TokenDto } from './dto/token.dto'


@Injectable()
export class UserService{
    constructor(
        @InjectModel('User') private userModel: Model<any>,
         private jwtService: JwtService  
        ){}
    
    private errorResponses = {
        usernameRequired: {
            statusCode: 400,
            message: "Send username"
        },
        passwordRequired: {
            statusCode: 400,
            message: "Send password"
        },
        wrongPassword: {
            statusCode: 401,
            message: "Wrong Password"
        },
        usernameAlreadyExist: {
            statusCode: 403,
            message: "Username already exist. Choose anothe one"
        },
        usernameDoesNotExist: {
            statusCode: 401,
            message: "Username does not exist"
        },
        userNotFound: {
            statusCode: 404,
            message: "User Not Found"
        }
    }

    private saltOrRounds:number = 11;

    private hashPassword(password: string):string{
        return bcrypt.hashSync(password, this.saltOrRounds);
    }

    private comparePassword(password: string, hash: string): boolean{
        return bcrypt.compareSync(password, hash);
    }

    async getUsers(){
        const users =  await this.userModel.find();
        if(!users.length) return this.errorResponses.userNotFound
        return users
    }

    async getUser(username:string){
        if(!username) return this.errorResponses.usernameRequired

        const user:CreateUserDto =  await this.userModel.findOne({username});

        if(!user) return this.errorResponses.usernameDoesNotExist

        user.password = undefined
        
        return user
    }

    async createUser(createUserDto: CreateUserDto){
        if(!createUserDto) return this.errorResponses.usernameRequired
        if(!createUserDto.username) return this.errorResponses.usernameRequired
        if(!createUserDto.password) return this.errorResponses.passwordRequired

        // checking if that username exist
        const check:CreateUserDto = await this.userModel.findOne({username: createUserDto.username});
        if(check)return this.errorResponses.usernameAlreadyExist
        // encrypting the password
        const newUser:CreateUserDto = {
            ...createUserDto,
            password: this.hashPassword(createUserDto.password)
        }
        // creating the new user and save it
        const user = new this.userModel(newUser)
        const userSaved = await user.save()
        // deleting the password before send to the client
        const payload = {username: userSaved.username, _id: userSaved._id}
        const secretToken = this.jwtService.sign(payload, {secret: "una vaina"})
        
        return {secretToken, username: newUser.username}
    }

    async loginUser(userInfo: CreateUserDto){
        if(!userInfo) return this.errorResponses.usernameRequired
        if(!userInfo.username) return this.errorResponses.usernameRequired
        if(!userInfo.password) return this.errorResponses.passwordRequired


        // getting user from db
        const user = await this.userModel.findOne({username: userInfo.username});
        // check if user exist
        if(!user) return this.errorResponses.usernameDoesNotExist
        // check if is the correct password
        if(!this.comparePassword(userInfo.password,user.password)) return this.errorResponses.wrongPassword
        // deleting the password before send to the client

        const payload = {username: user.username, _id: user._id}
        const secretToken = this.jwtService.sign(payload, {secret: "una vaina"})
        
        return {secretToken, username: userInfo.username}
    }

    async deleteUser(username: string, password: string){
        // getting user from db
        const user:CreateUserDto = await this.userModel.findOne({username});
        // check if user exist
        if(!user) return this.errorResponses.usernameDoesNotExist
        // check if is the correct password
        if(!this.comparePassword(password,user.password)) return this.errorResponses.wrongPassword

        return await this.userModel.deleteOne({username});
    } 
}


