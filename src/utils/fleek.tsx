import fleek from '@fleekhq/fleek-storage-js';   
export const fleekUpLoad = async(key:string,myFile:any)=>{
    const input = {
        apiKey: process.env.NEXT_PUBLIC_FLEEK_STORAGE_KEY,
        apiSecret: process.env.NEXT_PUBLIC_FLEEK_SECRET,
        key: key,
        data: myFile,
      };
    
      const result = await fleek.upload(input);
      return result
}