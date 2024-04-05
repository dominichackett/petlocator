'use client'
import { useState ,useEffect,useRef} from 'react'
import { Dialog, Disclosure } from '@headlessui/react'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import PetList from '@/components/PetList/PetList'
import AddPet from '@/components/AddPet/AddPet'
import ContactList from '@/components/ContactList/ContactList'
import AddContact from '@/components/AddContact/AddContact'
import Messages from '@/components/Messages/Messages'
import Profile from '@/components/Profile/Profile'
import VideoCall from '@/components/VideoCall/VideoCall'
import Mint from '@/components/Mint/Mint'
import { queryProfile } from '../tableland/tableland'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import Notification from '@/components/Notification/Notification'
import {
    Bars3Icon,
    BellIcon,
    CalendarIcon,
    ChartPieIcon,
    Cog6ToothIcon,
    DocumentDuplicateIcon,
    VideoCameraIcon,
    HomeIcon,
    UsersIcon,
    UserIcon,
    
    XMarkIcon,ChatBubbleLeftIcon
  } from '@heroicons/react/24/outline'
  import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { disconnect } from 'process'
  
  const navigation = [
    { name: 'Pets', href: '#', icon: HomeIcon, current: true },
    { name: 'Contacts', href: '#', icon: UsersIcon, current: false },
    { name: 'Messages', href: '#', icon: ChatBubbleLeftIcon, current: false },
    { name: 'Video Calls', href: '#', icon: VideoCameraIcon, current: false },
    { name: 'Profile', href: '#', icon: UserIcon, current: false },
    { name: 'Mint USDC Tokens', href: '#', icon: ChartPieIcon, current: false },
  ]
  const teams = [
   
  ]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Dashboard() {
  const [preview, setPreview] = useState('')
  const [selectedFile, setSelectedFile] = useState(undefined)
  const [profileExist,setProfileExist] = useState(false)
  const [gotProfile,setGotProfile] = useState(false)
  const [profile,setProfile] = useState({})
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedMenuItem,setSelectedMenuItem] = useState("Pets")
  const [showPetForm,setShowPetForm] = useState(false)
  const [showContactForm,setShowContactForm] = useState(false)
  const router = useRouter()
  const profilePicRef = useRef("");
   
  const account = useAccount()
// NOTIFICATIONS functions
const [notificationTitle, setNotificationTitle] = useState();
const [notificationDescription, setNotificationDescription] = useState();
const [dialogType, setDialogType] = useState(1);
const [show, setShow] = useState(false);
const close = async () => {
setShow(false);
};
  const menuClicked = (item:any) =>{
     setSelectedMenuItem(item)
  }

  const addPetClicked = (value:any,saved:any) =>{
    setShowPetForm(value)
    if(saved)
    {
     setNotificationTitle("Add Pet")  
    setNotificationDescription("Pet Tag Successfully Created")
    setDialogType(1) //Success
    setShow(true)    
  }
  }
  
  const addContactClicked = (value:any,saved:any) =>{
    setShowContactForm(value)
    if(saved)
    {
      setNotificationTitle("Add Contact")  

      setNotificationDescription("Contact Successfully Created")
      setDialogType(1) //Success
      setShow(true)    
    }
  }

  useEffect(()=>{
    async function getProfile()
    {
       const _profile = await queryProfile(account.address)
       if(_profile.length > 0)
      {
         setGotProfile(true)
         setProfileExist(true)
         setProfile(_profile[0])
        
         const image =  await fetch(_profile[0].photo)
         if(image.ok)
         {
              console.log(image)
               setSelectedFile(await image.blob())
               // const objectUrl = URL.createObjectURL(await image.blob())
               //setPreview(objectUrl)
         }   
        else
      {
        setGotProfile(true)
        setProfileExist(false)
      }   
    }
  } 
    
    if(account?.address)
    getProfile()
  // if(account.status == 'disconnected')
    //  router.push("/") 
   
  },[account?.address])

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
  
  useEffect(()=>{
    console.log(account.status)
  },[])
  return (
    <main>
    {/* Header */}
    
    <Header />
        {/* Hero section */}
        <div className="relative isolate overflow-hidden bg-indigo-500 pb-16 pt-14 sm:pb-20">
            
        {/* Tinted background image */}
  

    {/* Indigo tint */}
    <div className="absolute inset-0 bg-indigo-900 bg-opacity-60 -z-10" />

        
    
        </div>
        <div className=" grid grid-cols-1  sm:grid-cols-4 ">
     
     <nav className="flex grow col-span-1 flex flex-1 flex-col bg-indigo-500 h-full">
               <ul role="list" className="flex flex-1 flex-col gap-y-7">
                 <li>
                   <ul role="list" className="-mx-2 space-y-1">
                     {navigation.map((item) => (
                       <li key={item.name}>
                         <a
                           onClick={()=> menuClicked(item.name)}
                           className={classNames(
                             item.name == selectedMenuItem
                               ? 'bg-indigo-700 text-white'
                               : 'text-indigo-200 hover:text-white hover:bg-indigo-700',
                             'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                           )}
                         >
                           <item.icon
                             className={classNames(
                               item.current ? 'text-white' : 'text-indigo-200 group-hover:text-white',
                               'h-6 w-6 shrink-0'
                             )}
                             aria-hidden="true"
                           />
                           {item.name}
                         </a>
                       </li>
                     ))}
                   </ul>
                 </li>
                
                 <li className="-mx-6 mt-auto">
                   <a
                     href="#"
                     className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-indigo-700"
                   >
                     <img
                       className="h-8 w-8 rounded-full bg-indigo-700"
                       src={preview ? preview : "/images/profile.png"}
                       alt=""
                     />
                     <span className="sr-only">Your profile</span>
                     <span aria-hidden="true">{profile?.name}</span>
                   </a>
                 </li>
               </ul>
             </nav>

             <div className="col-span-3 flex bg-gray-100">
    {(selectedMenuItem=="Pets" && !showPetForm) &&<PetList showpetform={addPetClicked} />}
   {(selectedMenuItem=="Pets" && showPetForm== true) && <AddPet showpetform={addPetClicked}/>}
   {(selectedMenuItem=="Contacts" && !showContactForm) &&<ContactList showcontactform={addContactClicked} />}
   {(selectedMenuItem=="Contacts" && showContactForm== true) && <AddContact showcontactform={addContactClicked}/>}
   {(selectedMenuItem=="Messages") &&<Messages />}
   {(selectedMenuItem=="Profile") &&<Profile />}
   {(selectedMenuItem=="Video Calls") &&<VideoCall address={account?.address}/>}
   {(selectedMenuItem=="Mint USDC Tokens") &&<Mint />}





  </div>
       </div> 
      
    

      {/* Footer */}
      <Notification
        type={dialogType}
        show={show}
        close={close}
        title={notificationTitle}
        description={notificationDescription}
      />
     <Footer />
     </main>

  )
}
