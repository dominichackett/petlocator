import { useState,useEffect } from "react";
import { Chat, ITheme } from '@pushprotocol/uiweb';
import { ProposedEventNames } from "@pushprotocol/restapi/src/lib/pushstream/pushStreamTypes";
import { useAccount } from 'wagmi'
import { providers } from 'ethers'

import { ethers } from "ethers";

export default function PetChat(props:any){
    const account = useAccount()
    const [signer,setSigner] = useState()   
      const theme: ITheme = {
        bgColorPrimary: '#FFFFFF',      // Dark background color
        bgColorSecondary: '#FFFFFF',    // Slightly lighter secondary background
        textColorPrimary: '#000000',    // White text
        textColorSecondary: '#A0A0A0',  // Light gray for secondary text
        btnColorPrimary: 'green',     //
        btnColorSecondary: '#800080',   // A complementary color for secondary buttons (e.g., purple)
        border: '1px solid #303030',     // Slightly lighter border color
        borderRadius: '8px',             // Rounded corners for elements
        moduleColor: '#a5b4fc',         // A vibrant color for chat modules (e.g., pink)
      };

      useEffect(()=>{ 
        async function setup()
        {
          const provider = new providers.Web3Provider(window.ethereum)
          const _signer = provider.getSigner(account.address) 
           
          setSigner(_signer)
          
         
       
        }  
         
        if(account?.address)
          setup()
      },[account?.address])

    
   return (
    signer ? (
      <Chat
        account={account?.address}
        supportAddress={props.addressToMessage} //"0x86820D4C1C9E12F5388136B19Da99A153ED767C1"
        apiKey=""
        signer={signer}
        env='staging'
        theme={theme}
        modalTitle={props.personToMessage}
      />
    ) : null
  );
}   
