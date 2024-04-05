import { useState,useEffect } from "react";
import { ChatAndNotificationWidget,PUSH_TABS } from "@pushprotocol/uiweb";
import * as PushAPI from '@pushprotocol/restapi';
import { IUser } from '@pushprotocol/restapi';
import { useAccount } from 'wagmi'
import { providers } from 'ethers'

import { ethers } from "ethers";
export default function Messages(props:any){
    const account = useAccount()
    const [activeChat,setActiveChat] = useState()
    const [privateKey,setPrivateKey]  = useState()
    const [signer,setSigner] = useState()
    useEffect(()=>{ 
        async function setup()
        {
          const provider = new providers.Web3Provider(window.ethereum)
          const _signer = provider.getSigner(account.address) 
           
           const user = await PushAPI.user.get({ account: `eip155:${account.address}`, env:"staging" });
                 if (user?.encryptedPrivateKey) {
                     const response = await PushAPI.chat.decryptPGPKey({
                         encryptedPGPPrivateKey: (user as IUser).encryptedPrivateKey,
                         account: account.address,
                         signer: _signer,
                         env:"staging",
                         toUpgrade: true,
                       });
                  setPrivateKey(response);
                  setSigner(_signer)
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