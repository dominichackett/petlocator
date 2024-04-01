import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid'
import { queryPetsByOwner } from '@/app/tableland/tableland'
import { useAccount } from 'wagmi'
import { useEffect,useState } from 'react'
const people = [
  {
    name: 'Jane Cooper',
    title: 'Paradigm Representative',
    role: 'Admin',
    email: 'janecooper@example.com',
    telephone: '+1-202-555-0170',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  // More people...
]

export default function PetList(props:any) {
  const account = useAccount()
  const [pets,setPets] = useState([])
  useEffect(()=>{
    async function getPets(){
      const _pets = await queryPetsByOwner(account?.address)
      console.log(_pets)
      setPets(_pets)
     }
    if(account?.address)
      getPets()
  },[account])

  return (
    <div>
      <button onClick={()=>props.showpetform(true)} className='text-white bg-indigo-700 p-3 m-4 rounded-md hover:bg-indigo-500'>Add Pet</button>
    <ul role="list" className="m-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {pets.map((pet) => (
        <li
          key={pet.id}
          className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
        >
          <div className="flex flex-1 flex-col p-8">
            <img className="mx-auto h-32 w-32 flex-shrink-0 rounded-full" src={pet.photo} alt="" />
            <h3 className="mt-6 text-sm font-medium text-gray-900">{pet.name}</h3>
            <dl className="mt-1 flex flex-grow flex-col justify-between">
              <dt className="sr-only">Id</dt>
              <dd className="text-sm text-gray-500">{pet.id}</dd>
              <dt className="sr-only">Type</dt>
              <dd className="mt-3">
                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  {pet.pettype}
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
