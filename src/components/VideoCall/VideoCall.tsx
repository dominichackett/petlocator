import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faVideo, faPhone, faPhoneAlt, faVideoSlash, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';
import type { NextPage } from 'next';
import Head from 'next/head';

import * as PushAPI from '@pushprotocol/restapi';
import { ENV } from '@pushprotocol/restapi/src/lib/constants';
import { produce } from 'immer';
import styled from 'styled-components';

import { usePushSocket } from '../../hooks/usePushSockets';
import { useEffect, useRef, useState } from 'react';
import VideoPlayer from './VideoPlayer';
import { ADDITIONAL_META_TYPE } from '@pushprotocol/restapi/src/lib/payloads/constants';
import { useEthersSigner } from "@/utils/ethers";
import { useAccount } from 'wagmi'
interface VideoCallMetaDataType {
  recipientAddress: string;
  senderAddress: string;
  chatId: string;
  signalData?: any;
  status: number;
}

// env which will be used for the video call
const env = ENV.STAGING;
export default function VideoCall(props:any){
    const [privateKey,setPrivatKey]  = useState()
    const account = useAccount()
    const [activeChat,setActiveChat] = useState()
    const signer = useEthersSigner()
    const [isMicMuted, setMicMuted] = useState(false);
    const [isCameraOff, setCameraOff] = useState(false);
    const [currentCall,setCurrentCall] = useState()
    const [incomingCall,setIncomingCall] = useState() 
    const dialRef = useRef(null);
    const incomingRef = useRef(null);

    const handleDialAudio = (arg:number) => {

      if(arg==1)
      dialRef.current.play();
    else
      dialRef.current.pause();
    };
  
  const handleIncomingAudio = (arg:number) => {
    if(arg==1)
      incomingRef.current.play();
    else
    incomingRef.current.pause();
  };

     const { pushSocket, isPushSocketConnected, latestFeedItem } = usePushSocket({
        env,chain:5,address:props.address
      });
    
      const videoObjectRef = useRef<PushAPI.video.Video>();
      const recipientAddressRef = useRef<HTMLInputElement>(null);
    
      const [data, setData] = useState<PushAPI.VideoCallData>(
        PushAPI.video.initVideoCallData
      );
    



   
     
   
   
  const toggleMic = () => {
    setMicMuted(!isMicMuted);
    videoObjectRef.current?.enableAudio({
        state: !data.local.audio,
      })
  };

  const toggleCamera = () => {
    setCameraOff(!isCameraOff);
    videoObjectRef.current?.enableVideo({
        state: !data.local.video,
      })
  };
  const setRequestVideoCall = async () => {
    setCurrentCall(true)
    handleDialAudio(1)
    // fetching chatId between the local address and the remote address
    const user = await PushAPI.user.get({
      account: props.address!,
      env,
    });
    console.log(props.address)
    let pgpPrivateKey = null;
    if (user?.encryptedPrivateKey) {
      pgpPrivateKey = await PushAPI.chat.decryptPGPKey({
        encryptedPGPPrivateKey: user.encryptedPrivateKey,
        account: props.address,
        signer,
        env,
      });
    }
    console.log(user)
    const response = await PushAPI.chat.chats({
      account: props.address!,
      toDecrypt: true,
      pgpPrivateKey: pgpPrivateKey,
      env,
    });
   console.log(response)
    let chatId = '';
    for (const chat of response) {
      console.log(chat.did.toLowerCase())
      if (chat.did == 'eip155:' + props.addressToCall) {
        chatId = chat.chatId;
        console.log("Chatting");
        break; // Exit the loop when a match is found, assuming you only need one chat.
      }
    }
    console.log(chatId)
    if (!chatId) return;

    // update the video call 'data' state with the outgoing call data
    videoObjectRef.current?.setData((oldData) => {
      return produce(oldData, (draft: any) => {
        if (!props.addressToCall) return;

        draft.local.address = props.address;
        draft.incoming[0].address = props.addressToCall;
        draft.incoming[0].status = PushAPI.VideoCallStatus.INITIALIZED;
        draft.meta.chatId = chatId;
      });
    });

    // start the local media stream
    await videoObjectRef.current?.create({ video: true, audio: true });
  };


  const setIncomingVideoCall = async (
    videoCallMetaData: VideoCallMetaDataType
  ) => {
    // update the video call 'data' state with the incoming call data
    videoObjectRef.current?.setData((oldData) => {
      return produce(oldData, (draft) => {
        draft.local.address = videoCallMetaData.recipientAddress;
        draft.incoming[0].address = videoCallMetaData.senderAddress;
        draft.incoming[0].status = PushAPI.VideoCallStatus.RECEIVED;
        draft.meta.chatId = videoCallMetaData.chatId;
        draft.meta.initiator.address = videoCallMetaData.senderAddress;
        draft.meta.initiator.signal = videoCallMetaData.signalData;
      });
    });
     console.log("Start the thing")
     console.log(videoCallMetaData)
     console.log(videoObjectRef.current)
    // start the local media stream
    await videoObjectRef.current?.create({ video: true, audio: true });
    setCurrentCall(true)
  };
  const acceptVideoCallRequest = async () => {
      console.log(data.local)
      handleIncomingAudio(2)  //Stop ringing
      handleDialAudio(2)

    if (!data.local.stream) return;

    await videoObjectRef.current?.acceptRequest({
      signalData: data.meta.initiator.signal,
      senderAddress: data.local.address,
      recipientAddress: data.incoming[0].address,
      chatId: data.meta.chatId,
    });
  };

  const connectHandler = ({
    signalData,
    senderAddress,
  }: VideoCallMetaDataType) => {
   videoObjectRef.current?.connect({
      signalData,
      peerAddress: senderAddress,
    });
    handleDialAudio(2)
    
  };

    // initialize video call object
    useEffect(() => {
        if (!signer || !props.address) return;
    
        (async () => {
          const user = await PushAPI.user.get({
            account: props.address,
            env,
          });
          let pgpPrivateKey = null;
          if (user?.encryptedPrivateKey) {
            pgpPrivateKey = await PushAPI.chat.decryptPGPKey({
              encryptedPGPPrivateKey: user.encryptedPrivateKey,
              account: props.address,
              signer,
              env,
            });
          }
    
          videoObjectRef.current = new PushAPI.video.Video({
            signer,
            chainId: 5,
            pgpPrivateKey,
            env,
            setData,
          });
        })();
      }, [signer, props.address]);

        // after setRequestVideoCall, if local stream is ready, we can fire the request()
  useEffect(() => {
    (async () => {
      const currentStatus = data.incoming[0].status;

      if (
        data.local.stream &&
        currentStatus === PushAPI.VideoCallStatus.INITIALIZED
      ) {
        await videoObjectRef.current?.request({
          senderAddress: data.local.address,
          recipientAddress: data.incoming[0].address,
          chatId: data.meta.chatId,
        });
      }
    })();
  }, [data.incoming, data.local.address, data.local.stream, data.meta.chatId]);

  // establish socket connection
  useEffect(() => {
    if (!pushSocket?.connected) {
      pushSocket?.connect();
    }
  }, [pushSocket]);
  // receive video call notifications
  useEffect(() => {
    if (!isPushSocketConnected || !latestFeedItem) return;

    const { payload } = latestFeedItem || {};

    // check for additionalMeta
    if (
      !Object.prototype.hasOwnProperty.call(payload, 'data') ||
      !Object.prototype.hasOwnProperty.call(payload['data'], 'additionalMeta')
    )
      return;

    const additionalMeta = payload['data']['additionalMeta'];
    console.log('RECEIVED ADDITIONAL META', additionalMeta);
    if (!additionalMeta) return;

    // check for PUSH_VIDEO
    if (additionalMeta.type !== `${ADDITIONAL_META_TYPE.PUSH_VIDEO}+1`) return;
    const videoCallMetaData = JSON.parse(additionalMeta.data);
    console.log('RECIEVED VIDEO DATA', videoCallMetaData);
    setIncomingCall(true)

    if (videoCallMetaData.status === PushAPI.VideoCallStatus.INITIALIZED) {


      setIncomingVideoCall(videoCallMetaData);
        

      console.log("Incoming Call Data")
      handleIncomingAudio(1)

    } else if (
      videoCallMetaData.status === PushAPI.VideoCallStatus.RECEIVED ||
      videoCallMetaData.status === PushAPI.VideoCallStatus.RETRY_RECEIVED
    ) {
      connectHandler(videoCallMetaData);
    } else if (
      videoCallMetaData.status === PushAPI.VideoCallStatus.DISCONNECTED
    ) {
      ///window.location.reload();
      setIncomingCall(false)
      setCurrentCall(false)
      handleDialAudio(2)
      handleIncomingAudio(2)
    } else if (
      videoCallMetaData.status === PushAPI.VideoCallStatus.RETRY_INITIALIZED &&
      videoObjectRef.current?.isInitiator()
    ) {
      videoObjectRef.current?.request({
        senderAddress: data.local.address,
        recipientAddress: data.incoming[0].address,
        chatId: data.meta.chatId,
        retry: true,
      });
    } else if (
      videoCallMetaData.status === PushAPI.VideoCallStatus.RETRY_INITIALIZED &&
      !videoObjectRef.current?.isInitiator()
    ) {
      videoObjectRef.current?.acceptRequest({
        signalData: videoCallMetaData.signalingData,
        senderAddress: data.local.address,
        recipientAddress: data.incoming[0].address,
        chatId: data.meta.chatId,
        retry: true,
      });
    }else if(videoCallMetaData.status === PushAPI.VideoCallStatus.CONNECTED){
      handleDialAudio(2)
      handleIncomingAudio(2)
      
    }
  }, [latestFeedItem]);

  const hangUp = async()=>{
    setCurrentCall(false)
    handleIncomingAudio(2)
    handleDialAudio(2)
    videoObjectRef.current?.disconnect({
      peerAddress: data.incoming[0].address,
    })
    
  }

   return (
    signer ? (
        <div className=" relative w-full">
        <label
          htmlFor="file"
          className="cursor-pointer relative flex flex-col h-[600px] min-h-[200px] w-full items-center justify-center rounded-lg border border-dashed border-[#A1A0AE] bg-[#353444] p-2 text-center"
        >
{(incomingCall && !props.caller && !currentCall ) && (
  <h1 className="mb-10 text-3xl font-bold tracking-tight text-white animate-blink">Incoming Call</h1>
)}

{(props.caller && currentCall ) && (
  <h1 className="mb-10 text-3xl font-bold tracking-tight text-white animate-blink">Outgoing Call</h1>
)}
          <div className="mb-4">
            <div className="flex space-x-2 w-full">
              <div className="">
                <div  >
                  <VideoPlayer  stream={data.local.stream} isMuted={true}/>
                  <div className="mt-2 text-center text-white">You</div>
                </div>
              </div>
              <div className="">
                <div >
                  <VideoPlayer stream={data.incoming[0].stream} isMuted={false} />
                  <div className="mt-2 text-center text-white">{props?.personTocall ? props.personTocall: "Other Caller"}</div>
                </div>
              </div>
            </div>
          </div>
  
          <div className="flex justify-center mt-12">
            <button className={`mr-2 text-white ${isMicMuted ? 'text-red-500' : ''}`} onClick={toggleMic}   disabled={
                data.incoming[0].status ===
                PushAPI.VideoCallStatus.UNINITIALIZED
              }>
              <FontAwesomeIcon icon={isMicMuted ? faMicrophoneSlash : faMicrophone} size="1x" color={isMicMuted ? "red":"white"} /> {isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
            </button>
            <button className={`mr-2 text-white ${isCameraOff ? 'text-red-500' : ''}`} onClick={toggleCamera}  disabled={
                data.incoming[0].status ===
                PushAPI.VideoCallStatus.UNINITIALIZED
              }>
              <FontAwesomeIcon icon={isCameraOff ? faVideoSlash : faVideo} size="1x" color={isCameraOff ? "red":"white"} /> {isCameraOff ? 'Turn On Camera' : 'Turn Off Camera'}
            </button>
           {currentCall    && <button className="mr-2 text-red"
                onClick={() => hangUp()
                   
                  }>
              <FontAwesomeIcon icon={faPhone} size="1x" color="red" /> Hangup
            </button>}
            {(!props.caller && data.incoming[0].status ===
                PushAPI.VideoCallStatus.RECEIVED && incomingCall) && <button className="mr-2 text-green" onClick={acceptVideoCallRequest}>
              <FontAwesomeIcon icon={faPhoneAlt} size="1x" color="green" /> Answer
            </button> }

            {(props.caller && !currentCall) && <button className="mr-2 text-green" onClick={setRequestVideoCall}>
              <FontAwesomeIcon icon={faPhoneAlt} size="1x" color="green" /> Call
            </button> }
          </div>
        </label>
        <audio loop={true} ref={dialRef}>
        <source src="/sound/dialing.mp3" type="audio/mpeg" />
      </audio>
      <audio loop={true}  ref={incomingRef}>
        <source src="/sound/incoming.mp3" type="audio/mpeg" />
      </audio>
      </div>
      
      
    ) : null
  );
}   
