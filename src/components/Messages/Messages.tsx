import { useState,useEffect } from "react";
import { ChatAndNotificationWidget,PUSH_TABS } from "@pushprotocol/uiweb";
import * as PushAPI from '@pushprotocol/restapi';
import { IUser } from '@pushprotocol/restapi';
import { useEthersSigner } from "@/utils/ethers";
import { useAccount } from 'wagmi'

export default function Messages(props:any){
    const account = useAccount()
    const [activeChat,setActiveChat] = useState()
    const signer = useEthersSigner()
    const [privateKey,setPrivateKey]  = useState()

    useEffect(()=>{
        async function setup()
        {
           //   setAccount(`eip155:${}`);
             // setActiveChat(props?.addressToMessage)
             // setSigner(web3Provider?.getSigner())         
           const user = await PushAPI.user.get({ account: `eip155:${account.address}`, env:"staging" });
                 if (user?.encryptedPrivateKey) {
                     const response = await PushAPI.chat.decryptPGPKey({
                         encryptedPGPPrivateKey: (user as IUser).encryptedPrivateKey,
                         account: account.address,
                         signer: signer,
                         env:"staging",
                         toUpgrade: true,
                       });
                  setPrivateKey(response);
                 }
         
       
        }  
         
        if(account?.address)
          setup()
      },[account?.address])

    return (
        <ChatAndNotificationWidget
          account={`eip155:${account?.address}`}
          signer={signer}
          env="staging"
          activeTab={PUSH_TABS.CHATS}
          decryptedPgpPvtKey={privateKey}
        />)

}