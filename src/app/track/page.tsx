'use client'
import { useState } from 'react'
import { Dialog,Disclosure, Tab, Transition,Menu } from '@headlessui/react'

import { Bars3Icon, MinusSmallIcon, PlusSmallIcon, XMarkIcon ,ChatBubbleLeftIcon} from '@heroicons/react/24/outline'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import Notification from '@/components/Notification/Notification'
import { queryPetById ,queryContactsByPet} from '../tableland/tableland'
import VideoCall from '@/components/VideoCall/VideoCall'
import Chat from '@/components/Messages/Chat'
import { sendNotifications } from '@/utils/push'
import {
  
  CheckIcon,
  CloudArrowUpIcon,
  IdentificationIcon,
  ChatBubbleBottomCenterIcon,
  VideoCameraIcon,
  LockClosedIcon,
  ServerIcon,
  CircleStackIcon
} from '@heroicons/react/20/solid'
import { useEthersSigner } from "@/utils/ethers";
import { useAccount } from 'wagmi'
const navigation = [
  { name: 'Product', href: '#' },
  { name: 'Features', href: '#' },
  { name: 'Company', href: '#' },
]
const features = [
  {
    name: 'Fleek IPFS Storage.',
    description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit aute id magna.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Secured by Blockchain.',
    description: 'Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.',
    icon: LockClosedIcon,
  },
  {
    name: 'Tableland Database.',
    description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus.',
    icon: CircleStackIcon,
  },
  {
    name: 'Video Calls.',
    description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit aute id magna.',
    icon: VideoCameraIcon,
  },
  {
    name: 'Chat/Messaging.',
    description: 'Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.',
    icon: ChatBubbleBottomCenterIcon,
  },
  {
    name: 'Pet Data.',
    description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. ',
    icon: IdentificationIcon,
  },
]
const tiers = [
  {
    name: 'Single',
    id: 'single-pet',
    href: '#',
    priceMonthly: '$19',
    description: "The perfect plan for the single pet owner.",
    features: ['1 Pet', 'Video calls', 'Chat', 'Pet bio data','24-hour support response time'],
    featured: false,
  },
  {
    name: 'Multi Pet',
    id: 'five-pets',
    href: '#',
    priceMonthly: '$49',
    description: 'Support for up to 5 Pets.',
    features: [
      '5 Pets',
      'Video calls',
      'Chats',
      'Pet bio data',
      '24-hour support response time',
      'Dedicated support',
      'Pet insurance coverage'
    ],
    featured: true,
  },
]
const faqs = [
  {
    question: "How does Pet Locator work?",
    answer:
      "Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
  },
  // More questions...
]


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [preview, setPreview] = useState('')
  const account = useAccount()
  const [addressToCall,setAddressToCall] = useState()
  const [personTocall,setPersonTocall] = useState()
  const [personToMessage,setPersonToMessage] = useState()
  const [addressToMessage,setAddresToMessage] = useState()
  const [tagFound,setTagFound] = useState(false)
  const [tagQueried,setTagQueried] = useState(false)
  const [contacts,setContacts] = useState([])
  const PetTypes = ['Cat','Dog'];


  // NOTIFICATIONS functions
  const [notificationTitle, setNotificationTitle] = useState();
  const [notificationDescription, setNotificationDescription] = useState();
  const [dialogType, setDialogType] = useState(1);
  const [show, setShow] = useState(false);
  const close = async () => {
setShow(false);
};
  const [tag,setTag] = useState()
  const tagScanned = async()=>{
    const tagId = document.getElementById("tagid") .value
    if(!tagId)
    {
      setNotificationDescription("Please enter a Tag ID")
      setDialogType(2) 
      setNotificationTitle("Search Tag")
      setShow(true)
      return
    }
    const _tag = await queryPetById(tagId)
    if(_tag.length == 0 )
    {
      setContacts([])
      setTag(null)
      setNotificationDescription("Tag ID not found")
      setDialogType(2) 
      setNotificationTitle("Search Tag")
      setShow(true)
      return
    }
    setNotificationDescription("Tag ID found")
    setDialogType(1) 
    setNotificationTitle("Search Tag")
    setShow(true)
    setTag(_tag[0])
    setTagFound(true)
    setTagQueried(true)
    setPreview(_tag[0].photo)
    const _contacts = await queryContactsByPet(tagId)
    setContacts(_contacts)
    
    let contactList = []
    for(const _contact in _contacts)
    {
       contactList.push(`eip155:5:${_contacts[_contact].id}`)
    }
  
    const _date = new Date()
    //Send Push Notification
    await sendNotifications(`Tag ID: ${tagId} Scanned for ${_tag[0].name}`,`Date: ${_date.toDateString()}`,contactList)

  
  }

  const setCallData=(name:any,address:any)=>{
    if(!account?.address)
    {
       setDialogType(2) //Error
       setNotificationTitle("View Tag")
       setNotificationDescription("Please login to place call.")
       setShow(true)
       return
    }
    setPersonTocall(name)
    setAddressToCall(address)
  }

 
  const setMessageData=(name:any,address:any)=>{
     
    if(!account?.address)
    {
       setDialogType(2) //Error
       setNotificationTitle("View Tag")
       setNotificationDescription("Please login to send message.")
       setShow(true)
       return
    }
     setPersonToMessage(name)
     setAddresToMessage(address)   
  }
  
  return (
    <div className="bg-white">
      {/* Header */}
    
    <Header />
      <main>
        {/* Hero section */}
        <div className="relative isolate overflow-hidden bg-indigo-500 pb-16 pt-14 sm:pb-20">
            
        {/* Tinted background image */}
    <div className="absolute inset-0 -z-10 h-full w-full object-cover ">
        <img
            src="images/splash.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
        />
    </div>

    {/* Indigo tint */}
    <div className="absolute inset-0 bg-indigo-900 bg-opacity-60 -z-10" />

          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
              <div className="hidden sm:mb-8 sm:flex sm:justify-center">
               
              </div>
              <div className="text-center">
              <h1 className=" text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Pet Locator
                </h1>
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Find your furry friend, fast!
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-300">
                Never lose track of your beloved pet again with our advanced pet locator technology. Whether they&apos;ve wandered off or simply playing hide-and-seek, our system ensures a quick and reliable way to bring them home safely.
                </p>
               
              </div>
            </div>

        
          </div>
          <div
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>
        </div>

        {/* Feature section */}
        <div className="mt-32 sm:mt-56">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl sm:text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">Everything you need</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Pet Tracking.</p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque,
                iste dolor cupiditate blanditiis.
              </p>
            </div>
          </div>
         
           {/* Main*/}
           <div className="bg-black">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          <Tab.Group as="div" className="flex flex-col">
          
        
                         <div className="mb-8">
  
   <label
                      for="file"
                      className="cursor-pointer relative flex h-[480px] min-h-[200px] items-center justify-center rounded-lg border border-dashed border-[#A1A0AE] bg-[#353444] p-12 text-center"
                    >
                                           <img src={preview ? preview: '/images/petlogow.png'}/>

                    </label>
</div>
{(account?.address && addressToCall)&&<VideoCall address={account?.address} addressToCall={addressToCall} personTocall={personTocall} caller={true} />}
<div className="mb-8">
   
        <div
       
          className="mb-4 text-white rounded-md bg-[#4E4C64] flex items-center justify-center rounded-md py-4 px-8 border border-dashed border-[#A1A0AE] bg-[#353444]"
        >
                   <div className=" mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-white">Pet Tag Information</h1>

            <div className="mt-4 sm:col-span-3">
              <label htmlFor="country" className="block text-sm font-medium leading-6 text-white">
                Pet Tag ID
              </label>
              <div className="mt-2">
                <input
                  id="tagid"
                  name="tagid"
                  autoComplete="tagid"
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                  
              </div>
            </div>

        

            
              <div className="sm:flex-col1 mt-10 flex">
               
                <button
                                    
                
                  className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                onClick={()=> tagScanned()}>
                  Search Tag
                </button>

              </div>
        

      
          </div>
          
        </div>
     
    </div>
 
<div className="mb-8">
  {(account?.address && personToMessage && addressToMessage )&& <Chat address={account?.address} personToMessage={personToMessage} addressToMessage={addressToMessage} />}
<h1 className="mb-4 text-3xl font-bold tracking-tight text-white">Emergency Contacts</h1>

      {contacts.map((item, index) => (
        <div
          key={index}
          className="mb-4 text-white rounded-md bg-[#4E4C64] flex justify-between rounded-md py-4 px-8 border border-dashed border-[#A1A0AE] bg-[#353444]"
        >
          <span>{item.firstname} {item.lastname}</span>
          <div className="flex space-x-4">
            {/* Video Call Button */}
            <button className="flex items-center p-2 bg-red-500 text-white rounded-md" onClick={()=>setCallData(`${item.firstname} ${item.lastname}`,item.id)}>
              <VideoCameraIcon className="w-5 h-5 mr-2" /> {/* Adjust icon size and spacing */}
              Video Call
            </button>

            {/* Message Button */}
            <button className="flex items-center p-2 bg-green-500 text-white rounded-md" onClick={()=>setMessageData(`${item.firstname} ${item.lastname}`,item.id)}>
              <ChatBubbleLeftIcon className="w-5 h-5 mr-2" /> {/* Adjust icon size and spacing */}
              Message
            </button>
          </div>
        </div>
      ))}
    </div>
 
               
          </Tab.Group>
       
          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-white">Tag Information</h1>

            <div className="mt-4 sm:col-span-3">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-white">
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  value={tag?.name} 

                  autoComplete="name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                  
              </div>
            </div>

          
          

            <div className="mt-4 sm:col-span-3">
            <label htmlFor="PetTypeselect"  className="block text-sm font-medium leading-6 text-white">Pet Type:</label>

              <div className="mt-2">
      <select
        id="PetTypeselect"
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
        value={tag?.pettype} 
 
      >
        <option value="">Select a pet type</option>
        {PetTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select> 
              </div>
            </div>

          

            <div className="mt-4 sm:col-span-3">
              <label htmlFor="country" className="block text-sm font-medium leading-6 text-white">
                Description
              </label>
              <div className="mt-2">
              <textarea
                  id="description"
                  name="description"
                  rows={20}
                  value={tag?.description}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                  
              </div>
            </div>

          
            
    
           

            
            

      
          </div>
        </div>
      </div>
    </div>
        </div>

        {/* Testimonial section */}
        <div className="relative z-10 mt-32 bg-gray-900 pb-20 sm:mt-56 sm:pb-24 xl:pb-0">
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute left-[calc(50%-19rem)] top-[calc(50%-36rem)] transform-gpu blur-3xl">
              <div
                className="aspect-[1097/1023] w-[68.5625rem] bg-gradient-to-r from-[#ff4694] to-[#776fff] opacity-25"
                style={{
                  clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                }}
              />
            </div>
          </div>
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-x-8 gap-y-10 px-6 sm:gap-y-8 lg:px-8 xl:flex-row xl:items-stretch">
            <div className="-mt-8 w-full max-w-2xl xl:-mb-8 xl:w-96 xl:flex-none">
              <div className="relative aspect-[2/1] h-full md:-mx-8 xl:mx-0 xl:aspect-auto">
                <img
                  className="absolute inset-0 h-full w-full rounded-2xl bg-gray-800 object-cover shadow-2xl"
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2102&q=80"
                  alt=""
                />
              </div>
            </div>
            <div className="w-full max-w-2xl xl:max-w-none xl:flex-auto xl:px-16 xl:py-24">
              <figure className="relative isolate pt-6 sm:pt-12">
                <svg
                  viewBox="0 0 162 128"
                  fill="none"
                  aria-hidden="true"
                  className="absolute left-0 top-0 -z-10 h-32 stroke-white/20"
                >
                  <path
                    id="b56e9dab-6ccb-4d32-ad02-6b4bb5d9bbeb"
                    d="M65.5697 118.507L65.8918 118.89C68.9503 116.314 71.367 113.253 73.1386 109.71C74.9162 106.155 75.8027 102.28 75.8027 98.0919C75.8027 94.237 75.16 90.6155 73.8708 87.2314C72.5851 83.8565 70.8137 80.9533 68.553 78.5292C66.4529 76.1079 63.9476 74.2482 61.0407 72.9536C58.2795 71.4949 55.276 70.767 52.0386 70.767C48.9935 70.767 46.4686 71.1668 44.4872 71.9924L44.4799 71.9955L44.4726 71.9988C42.7101 72.7999 41.1035 73.6831 39.6544 74.6492C38.2407 75.5916 36.8279 76.455 35.4159 77.2394L35.4047 77.2457L35.3938 77.2525C34.2318 77.9787 32.6713 78.3634 30.6736 78.3634C29.0405 78.3634 27.5131 77.2868 26.1274 74.8257C24.7483 72.2185 24.0519 69.2166 24.0519 65.8071C24.0519 60.0311 25.3782 54.4081 28.0373 48.9335C30.703 43.4454 34.3114 38.345 38.8667 33.6325C43.5812 28.761 49.0045 24.5159 55.1389 20.8979C60.1667 18.0071 65.4966 15.6179 71.1291 13.7305C73.8626 12.8145 75.8027 10.2968 75.8027 7.38572C75.8027 3.6497 72.6341 0.62247 68.8814 1.1527C61.1635 2.2432 53.7398 4.41426 46.6119 7.66522C37.5369 11.6459 29.5729 17.0612 22.7236 23.9105C16.0322 30.6019 10.618 38.4859 6.47981 47.558L6.47976 47.558L6.47682 47.5647C2.4901 56.6544 0.5 66.6148 0.5 77.4391C0.5 84.2996 1.61702 90.7679 3.85425 96.8404L3.8558 96.8445C6.08991 102.749 9.12394 108.02 12.959 112.654L12.959 112.654L12.9646 112.661C16.8027 117.138 21.2829 120.739 26.4034 123.459L26.4033 123.459L26.4144 123.465C31.5505 126.033 37.0873 127.316 43.0178 127.316C47.5035 127.316 51.6783 126.595 55.5376 125.148L55.5376 125.148L55.5477 125.144C59.5516 123.542 63.0052 121.456 65.9019 118.881L65.5697 118.507Z"
                  />
                  <use href="#b56e9dab-6ccb-4d32-ad02-6b4bb5d9bbeb" x={86} />
                </svg>
                <blockquote className="text-xl font-semibold leading-8 text-white sm:text-2xl sm:leading-9">
                  <p>
                    Gravida quam mi erat tortor neque molestie. Auctor aliquet at porttitor a enim nunc suscipit
                    tincidunt nunc. Et non lorem tortor posuere. Nunc eu scelerisque interdum eget tellus non nibh
                    scelerisque bibendum.
                  </p>
                </blockquote>
                <figcaption className="mt-8 text-base">
                  <div className="font-semibold text-white">Judith Black</div>
                  <div className="mt-1 text-gray-400">Pet Owner</div>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>

      

      
      </main>

      {/* Footer */}
     <Footer />
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
