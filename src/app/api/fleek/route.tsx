// fleek.tsx

import { NextRequest, NextResponse } from 'next/server';
import { FleekSdk, ApplicationAccessTokenService } from '@fleekxyz/sdk';

const applicationService = new ApplicationAccessTokenService({
    clientId: process.env.NEXT_PUBLIC_FLEEK_CLIENTID,
})

const fleekSdk = new FleekSdk({ accessTokenService: applicationService });


export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");
        const filename = formData.get("filename");

            
        
        if (!filename || !file) {
            throw new Error('Bad Request: Missing filename or file data');
        }
        console.log(filename)

        // Call the function to add file to IPFS
        const result = await addToIPFS(filename, file);
        return NextResponse.json({ result:result });

        //return NextResponse.json( {Message:filename, status: 201 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

async function addToIPFS(filename: string, content: any) {
    try {
        // Add file to IPFS using Fleek SDK
        const result = await fleekSdk.ipfs().add({
            path: filename,
            content: content,
        });
        return result;
    } catch (error) {
        // Handle errors from Fleek SDK
        console.error('Error adding file to IPFS:', error);
        throw error; // Rethrow the error for the caller to handle
    }
}
