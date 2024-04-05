import {useForm  } from "react-hook-form";
import {useState,useRef,useEffect} from 'react';
import { PhotoIcon } from '@heroicons/react/24/solid'
import Notification from "../Notification/Notification"
import { Database } from "@tableland/sdk";
import { providers } from 'ethers'
import { useAccount } from 'wagmi'
import { ethers } from "ethers";
import { tagContractABI,tagContractAddress } from "@/contracts/contracts";
import { uploadToIPFS } from "@/utils/fleek";
import { insertPet,alterTable } from "@/app/tableland/tableland";

export default function AddPet(props:any) {

    const petPicRef = useRef("");
    const account = useAccount()


   
  const [preview, setPreview] = useState('')
  const [selectedFile, setSelectedFile] = useState(undefined)
 
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


  const PetPicClicked = (e) => {
    petPicRef.current.click(); 
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

    if(!selectedFile)
    {
      setNotificationTitle("Add Pet")
      setNotificationDescription("Please select an image.")
      setDialogType(2) //Error
      setShow(true)    
      return 
        
    }

    setIsSaving(true);

    setNotificationTitle("Add Pet")
    setNotificationDescription("Uploading Pet Image.")
    setDialogType(3) //Information
    setShow(true)     
   



  
    try 
    { 
      
      
      /*const provider = new providers.Web3Provider(window.ethereum)
 
      const _signer = provider.getSigner(account.address) 
      const db = new Database({_signer})  
      console.log(_signer.getAddress())     
      await alterTable(db)
      return*/
     
       setNotificationTitle("Add Pet")
      const provider = new providers.Web3Provider(window.ethereum)
      const _signer = provider.getSigner(account.address) 
 
       const result = await  uploadToIPFS(filename.current,selectedFile)
       //console.log(await result.json())
       const cid =result.cid.toV1().toString()
       const url = `https://${cid}.ipfs.cf-ipfs.com`
       
        setShow(false)
        console.log(data)

 
        setNotificationTitle("Add Pet")
        const contract = new ethers.Contract(tagContractAddress, tagContractABI, _signer);
      
  
 //export const tagContractABI = ['addUser(string memory _pname, string memory _oname, string memory _ptype, string memory _cid)public',
    
       const tx = await contract.callStatic.addUser(data.name,account.address, data.pettype, cid);
       const transaction = await contract.addUser(data.name,account.address, data.pettype, cid);
       await transaction.wait(); // Wait for the transaction to be mined
      // Wait for the event promise to be resolved
      // Access the transaction receipt for more information
    const receipt = await _signer.provider.getTransactionReceipt(transaction.hash);

    // Access event data from the receipt (replace 'YourEventName' with your actual event name)
    console.log(receipt)
    const iface = new ethers.utils.Interface(tagContractABI);

    const events = iface.parseLog(receipt.logs[2]);
   console.log(events)
    const tagId = events.args.tagId.toNumber();

       console.log(events.args); // Access event arguments

       await insertPet(tagId.toString(),account.address,data.name,data.pettype,url,data.description)

       setIsSaving(false)
       props.showpetform(false,true) 
    }catch(error){

      setNotificationTitle("Add Pet")
      setNotificationDescription(error.message)
      setDialogType(2) //Error
      setShow(true)    
      setIsSaving(false)

    }  

  }
 
  const { register,setValue, formState: { errors }, handleSubmit } = useForm();
  return (
 <div className="px-4 m-4 w-full">

   <form noValidate className="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit(_handleSubmit)}>
      <div className="space-y-8 divide-y divide-gray-200">
        <div>
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Add Pet</h3>
            
          </div>

          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                Name
              </label>
              <div className="shadow-sm focus:ring-my-blue focus:border-my-blue block w-full sm:text-sm border-gray-300 rounded-md"
>
                
                <input
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="name"
                  className="p-2 flex-1 focus:ring-my-blue focus:border-my-blue block w-full min-w-0 rounded-none rounded-md sm:text-sm border-gray-300"
                  {...register("name", { required: true })} 

               />
              </div>
              {errors.name?.type === 'required' && <span className="text-sm text-red-700">Name is required</span>}

            </div>
            <div className="sm:col-span-4">
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                Type
              </label>
              <div className="shadow-sm focus:ring-my-blue focus:border-my-blue block w-full sm:text-sm border-gray-300 rounded-md"
>                 <select id="pettype" name="pettype" className="p-2 flex-1 focus:ring-my-blue focus:border-my-blue block w-full min-w-0 rounded-none rounded-md sm:text-sm border-gray-300"
                            {...register("pettype", { required: true})} 

                 >
        <option value="">Select...</option>
        <option value="Cat">Cat</option>
        <option value="Dog">Dog</option>
      </select>   
             
              </div>
              {errors.pettype?.type === 'required' && <span className="text-sm text-red-700">Pet type is required</span>}

            </div>

         
    

      
            <div className="sm:col-span-6">
                <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                  Photo
                </label>
                <div className="mt-1 flex items-center">
                  <span className="h-40 w-40  overflow-hidden bg-gray-100">
                  
                  { preview ? <img
                 className="h-40 w-40 rounded-lg border-my-blue border-2"
                 src={preview}
                 alt=""
               /> : <PhotoIcon  className="h-40 w-40 border-my-blue border-2"/>}
                  </span>
                  <button
                    type="button"
                    className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-my-blue"
                    onClick={PetPicClicked}
                  >
                    Change
                  </button>
                  <input type="file"   accept="image/png, image/jpeg"  ref={petPicRef} hidden="true" onChange={PetPicSelected} />

                </div>
              </div>
  

            <div className="sm:col-span-6">
              <label htmlFor="about" className="block text-sm font-medium text-gray-700">
              Description
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="shadow-sm focus:ring-my-blue focus:border-my-blue block w-full h-40 sm:text-sm border border-gray-300 rounded-md"
                  {...register("description", { required: true})} 

                />
              </div>
              {errors.description?.type === 'required' && <span className="text-sm text-red-700">Description is required</span>}

            </div>

           
          </div>
        </div>

            </div>

      <div className="pt-5 ">
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-my-blue"
            onClick={()=>props.showpetform(false,false)}
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
