import { Database } from "@tableland/sdk";
import { ethers } from "ethers";
export const contactsTable ="contacts_314159_729"
export const petsTable ="pets_314159_730"

const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY)
const provider = new ethers.providers.JsonRpcProvider(
    "https://api.calibration.node.glif.io/rpc/v1"
  );

const signer = wallet.connect(provider);

const db = new Database({signer})  


export const queryContacts = async(owner:string)=>{
    try {
    const { results } = await db.prepare(`SELECT * FROM ${contactsTable} where owner='${owner}'  order by lastname,firstname;`).all();

   return results;
}
catch(error:any)
{
    return []
}

}




export const queryPetsByOwner = async(owner:string)=>{

    try{
    const { results } = await db.prepare(`SELECT * FROM ${petsTable} where owner='${owner}';`).all();

   return results;
    }
    catch(error:any)
    {
       console.log(error)
        return []
    }
}


export const queryPetById = async(id:string)=>{
    try{
    const { results } = await db.prepare(`SELECT * FROM ${petsTable} where tagid='${id}';`).all();

   return results;
}
catch(error:any)
{
    return []
}
}

