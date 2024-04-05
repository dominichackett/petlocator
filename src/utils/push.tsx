import * as ethers from "ethers";
import  { PushAPI} from "@pushprotocol/restapi";
import {ENV} from "@pushprotocol/restapi/src/lib/constants"

export const sendNotifications = async(title:string,message:string,recipients:any)=>{
    const env = ENV.STAGING
    const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_PUSH_ACCOUNT)
    const user = await PushAPI.initialize(wallet,{env:env})
    await user.channel.send(recipients,{notification: {title:  title,body:message,},})
    

}