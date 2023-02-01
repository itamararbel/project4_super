import { NextFunction } from 'express';
import { OkPacket } from "mysql";
import config from "../config";
import dal from "../dal/dal";
import user_modal from "../modal/clientModal";
import { client_error } from "../modal/client_error";
import jwtHundler from "../util/jwtHundler";
import logger from "../util/errorsLogger";
import hash from "../util/crypto_helper";
import UserAuthentic from '../modal/UserAuthentic';
import credsModal from '../modal/credsModal';
const userS = require("../modal/clientSchema");

const addNewUser = async (newUser: user_modal, next: NextFunction): Promise<string> => {
    console.log(newUser)
    newUser.user_password = hash(newUser.user_password);
    // let result: OkPacket
    const user = new userS(newUser);
    try {
        console.log(user)
        newUser = await user.save();
        console.log("from logic 21" + newUser._id.toString());
    } catch (err) {
        logger.info("user name exists: " + err)
        throw new client_error(403, "user name exists, plz choose another");
    }
    // newUser.user_id = result.insertId;
    return jwtHundler.createToken(new UserAuthentic(newUser.user_name, newUser._id.toString(), 1));
}

const relog = async (header: string): Promise<string> => {
    const payload: UserAuthentic = (jwtHundler.getUser(header) as any).user
    const newToken = jwtHundler.createToken(new UserAuthentic(payload.user_name, payload.user_id, payload.user_role))
    return newToken
}


const checkCredentials = async (user: credsModal): Promise<string> => {
    console.log(user)

    if (user.user_password === config.adminPassword && user.user_mail === config.adminUserName) {
        const userDetails = new UserAuthentic("bigsecret", "0", 0)
        return await jwtHundler.createToken(userDetails)
    }
    user.user_password = hash(user.user_password)
    // const sql = `select user_id, user_name from users_table where user_name = '${user.user_mail}' and password = '${user.user_password}'`;
    const userArr: user_modal[] = await userS.find({ user_mail: user.user_mail, user_password: user.user_password });
    console.log("check creds" + userArr);
    if (userArr.length > 0) {
        const userDetails = new UserAuthentic(userArr[0].user_name, userArr[0]._id, 1)
        return await jwtHundler.createToken(userDetails);
    } else {
        throw new client_error(401, "user name and/or password are incorrect")
    }
}

const getUserByID = async (id: string): Promise<user_modal> => {
    console.log("logic " + id)
    return await userS.findById(id).exec();
}

const checkMail = async(mail:string):Promise<boolean>=>{
     let temp = await userS.find({user_mail: mail})
    let isExists= temp.length>0? true:false;
    console.log(temp)
    return isExists
}


export default {
    checkCredentials,
    addNewUser,
    relog,
    getUserByID,
    checkMail
}