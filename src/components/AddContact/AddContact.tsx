import {useForm  } from "react-hook-form";
import {useState,useRef,useEffect} from 'react';
import Notification from "../Notification/Notification"
import { providers } from 'ethers'

import { useAccount } from 'wagmi'
import { ethers } from "ethers";
import { tagContractABI,tagContractAddress,USDCAddress,USDCABI } from "@/contracts/contracts";
import { insertContact ,queryPetsByOwner} from "@/app/tableland/tableland";
export default function AddContact(props:any) {

    const contactPicRef = useRef("");
    const account = useAccount()


   
  const [preview, setPreview] = useState('')
  const [selectedFile, setSelectedFile] = useState(undefined)
  const [pets,setPets] = useState([])
  // NOTIFICATIONS functions
   const [notificationTitle, setNotificationTitle] = useState();
   const [notificationDescription, setNotificationDescription] = useState();
   const [dialogType, setDialogType] = useState(1);
   const [show, setShow] = useState(false);
   const close = async () => {
 setShow(false);
};
  const filename = useRef()

  const [isSaving,setIsSaving]  = useState(false);
  
  

 
  const handleCloseNotification = () =>
  {
     setOpenNotification(false);
  }


  const ContactPicClicked = (e) => {
    contactPicRef.current.click(); 
  }; 

  const PetPicSelected = async (e:any) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined)
      return
  }

  // I've kept this example simple by using the first image instead of multiple
  setSelectedFile(e.target.files[0])
  filename.current = e.target.files[0].name
    
    }

    
  
    useEffect (()=>{
      async function getPets(){
        const _pets = await queryPetsByOwner(account.address)
        setPets(_pets)
      }

      if(account?.address)
        getPets()
    },[account])

    useEffect(() => {
      if (!selectedFile) {
          setPreview('')
          return
      }
    
      const objectUrl = URL.createObjectURL(selectedFile)
      setPreview(objectUrl)
    
      // free memory when ever this component is unmounted
      return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])
    

    const _handleSubmit = async (data:any,e:any) => {

  
      
  
    
      try 
      { 
        
        

         const provider = new providers.Web3Provider(window.ethereum)
         const _signer = provider.getSigner(account.address) 
 
        console.log(data)

 
        const USDCcontract = new ethers.Contract(USDCAddress, USDCABI, _signer);

        const contract = new ethers.Contract(tagContractAddress, tagContractABI, _signer);

          let tx = await USDCcontract.callStatic.approve(tagContractAddress,ethers.utils.parseEther("10"))
          let tx1 = await USDCcontract.approve(tagContractAddress,ethers.utils.parseEther("10")) 
          await tx1.wait()

          const tx2 = await contract.callStatic.addEmergencyContacts(data.petid,data.ethaddress,"USDC");
          const transaction = await contract.addEmergencyContacts(data.petid,data.ethaddress,"USDC");
          await transaction.wait(); // Wait for the transaction to be mined

          await insertContact(data.ethaddress,data.petid,account.address,data.firstname,data.lastname,data.telephone)
  
         setNotificationDescription("Contact Successfully Created")
         setDialogType(1) //Success
         setShow(true)    
         setIsSaving(false)
         props.showcontactform(false)
   
      }catch(error){
  
        setNotificationTitle("Add Contact")
        setNotificationDescription(error.message)
        setDialogType(2) //Error
        setShow(true)    
        setIsSaving(false)
  
      }  
  
    }

    function validateEthAddress(value:any){
      
  
        return ethers.utils.isAddress(value);
        
  
    }  
  const { register,setValue, formState: { errors }, handleSubmit } = useForm();
  return (
 <div className="px-4 m-4 w-full">

   <form noValidate className="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit(_handleSubmit)}>
      <div className="space-y-8 divide-y divide-gray-200">
        <div>
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Add Contact</h3>
            
          </div>

          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-4">
              <label htmlFor="petid" className="mb-2 block text-sm font-medium text-gray-700">
                Pet
              </label>
              <div className="shadow-sm focus:ring-my-blue focus:border-my-blue block w-full sm:text-sm border-gray-300 rounded-md"
>                 <select id="petid" name="petid" className="p-2 flex-1 focus:ring-my-blue focus:border-my-blue block w-full min-w-0 rounded-none rounded-md sm:text-sm border-gray-300"
                            {...register("petid", { required: true})} 

                 >
        <option value="">Select...</option>
        {pets.map((pet, index) => (
            <option key={index} value={pet.id}>{pet.name}</option>
          ))}
      </select>   
             
              </div>
              {errors.petid?.type === 'required' && <span className="text-sm text-red-700">Pet is required</span>}

            </div>

            <div className="sm:col-span-4">
              <label htmlFor="firstname" className="mb-2 block text-sm font-medium text-gray-700">
                First Name
              </label>
              <div className="shadow-sm focus:ring-my-blue focus:border-my-blue block w-full sm:text-sm border-gray-300 rounded-md"
>
                
                <input
                  type="text"
                  name="firstname"
                  id="firstname"
                  autoComplete="firstname"
                  className="p-2 flex-1 focus:ring-my-blue focus:border-my-blue block w-full min-w-0 rounded-none rounded-md sm:text-sm border-gray-300"
                  {...register("firstname", { required: true })} 

               />
              </div>
              {errors.firstname?.type === 'required' && <span className="text-sm text-red-700">First Name is required</span>}

            </div>

            <div className="sm:col-span-4">
              <label htmlFor="lastname" className="mb-2 block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <div className="shadow-sm focus:ring-my-blue focus:border-my-blue block w-full sm:text-sm border-gray-300 rounded-md"
>
                
                <input
                  type="text"
                  name="lastname"
                  id="lastname"
                  autoComplete="lastname"
                  className="p-2 flex-1 focus:ring-my-blue focus:border-my-blue block w-full min-w-0 rounded-none rounded-md sm:text-sm border-gray-300"
                  {...register("lastname", { required: true })} 

               />
              </div>
              {errors.lastname?.type === 'required' && <span className="text-sm text-red-700">Last Name is required</span>}

            </div>
            <div className="sm:col-span-4">
              <label htmlFor="ethAddress" className="mb-2 block text-sm font-medium text-gray-700">
                ETH Address
              </label>
              <div className="shadow-sm focus:ring-my-blue focus:border-my-blue block w-full sm:text-sm border-gray-300 rounded-md"
>
                
                <input
                  type="text"
                  name="ethaddress"
                  id="ethaddress"
                  autoComplete="ethaddress"
                  className="p-2 flex-1 focus:ring-my-blue focus:border-my-blue block w-full min-w-0 rounded-none rounded-md sm:text-sm border-gray-300"
                  {...register("ethaddress", { required: true ,validate:value =>{return validateEthAddress(value)}})} 

               />
              </div>
              {errors.ethaddress?.type === 'required' && <span className="text-sm text-red-700">ETH Address is required</span>}
              {errors.ethaddress?.type === 'validate' && <span className="text-sm text-red-700">Valid ETH address required </span>}

            </div>

         
    

      

            <div className="sm:col-span-6">
              <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
              Telephone
              </label>
              <div className="mt-1">
                <input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  className="p-2 flex-1 focus:ring-my-blue focus:border-my-blue block w-full min-w-0 rounded-none rounded-md sm:text-sm border-gray-300"
                  {...register("telephone", { required: true })} 

                />
              </div>
              {errors.telephone?.type === 'required' && <span className="text-sm text-red-700">Telephone is required</span>}
              
            </div>

           
          </div>
        </div>

            </div>

      <div className="pt-5 ">
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-my-blue"
            onClick={()=>props.showcontactform(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="cursor-pointer ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-my-blue-light"
          disabled={isSaving}
          >
            Save
          </button>
        </div>
      </div>
    </form>
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
