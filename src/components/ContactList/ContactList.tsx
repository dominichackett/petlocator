import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid'
import { useState,useEffect } from 'react'
import { queryContacts } from '@/app/tableland/tableland'
import { useAccount } from 'wagmi'



export default function ContactList(props:any) {
  const account = useAccount()
  const [contacts,setContacts] = useState([])
  useEffect(()=>{
    async function getContacts(){
      const _contacts = await queryContacts(account?.address)
      console.log(_contacts)
      setContacts(_contacts)
     }
    if(account?.address)
      getContacts()
  },[account?.address])
  return (
    <div>
      <button onClick={()=>props.showcontactform(true)} className='text-white bg-indigo-700 p-3 m-4 rounded-md hover:bg-indigo-500'>Add Contact</button>
    <ul role="list" className="m-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {contacts.map((person) => (
        <li
          key={person.id}
          className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
        >
          <div className="flex flex-1 flex-col p-8">
            <img className="mx-auto h-32 w-32 flex-shrink-0 rounded-full" src="/images/petlogo.png" alt="" />
            <h3 className="mt-6 text-sm font-medium text-gray-900">{person.firstname} {person.lastname}</h3>
            <dl className="mt-1 flex flex-grow flex-col justify-between">
              <dt className="sr-only">Telephone</dt>
              <dd className="text-sm text-gray-500">{person.telephone}</dd>
              <dt className="sr-only">PET</dt>
              <dd className="mt-3">
                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  {person.name}
                </span>
              </dd>
            </dl>
          </div>
          <div>
           
          </div>
        </li>
      ))}
    </ul>
    </div>
  )
}
