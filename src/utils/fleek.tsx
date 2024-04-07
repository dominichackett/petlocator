import { FleekSdk, ApplicationAccessTokenService } from '@fleekxyz/sdk';

const applicationService = new ApplicationAccessTokenService({
    clientId: process.env.NEXT_PUBLIC_FLEEK_CLIENTID
})

const fleekSdk = new FleekSdk({ accessTokenService: applicationService })

 export const project = async()=>{
  const projects = await fleekSdk.projects().list();
  return projects
}


// fleekSdk is an authenticated instance of FleekSDK
// with a selected projectId

export const uploadToIPFS = async (filename: string, content: Buffer) => {
  const result = await fleekSdk.ipfs().add({
      path: filename,
      content: content,
  })
  
  return result
}

// Assuming this code is within a React component

/*export const uploadToIPFS = async (filename:any, content:any) => {
  try {
      const formData = new FormData();
      formData.append('filename', filename);
      formData.append('file', content);
      const response = await fetch('/api/fleek', {
          method: 'POST',
          body: formData,
      });
     
      return response;
  } catch (error) {
      console.error('Error:', error);
      // You can choose to handle the error here or re-throw it for the caller to handle
      throw error;
  }
};
*/

