import { useEffect,useState } from 'react'
import { providers } from 'ethers'
import { useAccount } from 'wagmi'
import { ethers } from "ethers";
import Notification from "../Notification/Notification"
import { USDCAddress,USDCABI } from '@/contracts/contracts';
export default function Mint(props:any) {
  const account = useAccount()
 // NOTIFICATIONS functions
 const [notificationTitle, setNotificationTitle] = useState();
 const [notificationDescription, setNotificationDescription] = useState();
 const [dialogType, setDialogType] = useState(1);
 const [show, setShow] = useState(false);
 const close = async () => {
setShow(false);
};
   
const mintTokens = async()=>{


   try{ 
        const provider = new providers.Web3Provider(window.ethereum)
        const _signer = provider.getSigner(account.address) 
        const USDCcontract = new ethers.Contract(USDCAddress, USDCABI, _signer);
        let tx = await USDCcontract.callStatic.mint()
        let tx1 = await USDCcontract.mint() 
        await tx1.wait()

        const result = await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20',
                options: {
                    address: USDCAddress,
                    symbol: "USD",
                    decimals: 18,
                },
            },
        });

        setNotificationTitle("Mint USDC Tokens")
        setNotificationDescription("USDC Tokens Succesfully Minted")
        setDialogType(1) //Error
        setShow(true)    
    

   }catch(error){
  
    setNotificationTitle("Mint USDC Tokens")
    setNotificationDescription(error.message)
    setDialogType(2) //Error
    setShow(true)    

  }
    

}
  return (
    <div>
      <button onClick={()=>mintTokens()} className='text-white bg-indigo-700 p-3 m-4 rounded-md hover:bg-indigo-500'>Mint USDC Tokens</button>
      <Notification
        type={dialogType}
        show={show}
        close={close}
        title={notificationTitle}
        description={notificationDescription}
      />
    </div>
  )
}
