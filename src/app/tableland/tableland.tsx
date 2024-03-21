import { Database } from "@tableland/sdk";
import { ethers } from "ethers";
export const contactsTable ="contacts_314159_729"
export const petsTable ="pets_314159_730"
export const profilesTable = "profiles_314159_731"

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


export const queryProfile = async(id:string)=>{
    try{
    const { results } = await db.prepare(`SELECT * FROM ${profilesTable} where id='${id}';`).all();

   return results;
}
catch(error:any)
{
    return []
}
}


export const insertProfile =async (id:string,name:string,photo:string,description:string) => {
    // Insert a row into the table
const { meta: insert } = await db
.prepare(`INSERT INTO ${profilesTable} (id, name,photo,description) VALUES ( ?,?,?,?);`)
.bind(id,name,photo,description)
.run();

// Wait for transaction finality
//await insert.txn?.wait();
}



export const updateProfile =async (name:string,photo:string,description:string,id:string) => {
    // Insert a row into the table
const { meta: insert } = await db
.prepare(`Update ${profilesTable} set id=?, name=?,photo=?,description=? where id=?;`)
.bind(id,name,photo,description)
.run();

// Wait for transaction finality
//await insert.txn?.wait();
}


export const grantAccess = async ()=>{
    try{
         await db.prepare(`GRANT
        INSERT,
        UPDATE,
        DELETE
      ON
        ${contactsTable}
      TO
        '0x53B382216EB5CDC7b83455bb9D5d7E4202F21f56';`).run();
    
         await db.prepare(`GRANT
        INSERT,
        UPDATE,
        DELETE
      ON
        ${petsTable}
      TO
        '0x53B382216EB5CDC7b83455bb9D5d7E4202F21f56';`).run();


        await db.prepare(`GRANT
        INSERT,
        UPDATE,
        DELETE
      ON
        ${profilesTable}
      TO
        '0x53B382216EB5CDC7b83455bb9D5d7E4202F21f56';`).run();   
    
    }
    catch(error:any)
    {
        
    }
}