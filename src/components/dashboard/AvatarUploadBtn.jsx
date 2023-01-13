import React, { useState, useRef } from 'react'
import { Alert, Button, Modal } from 'rsuite';
import ModalBody from 'rsuite/lib/Modal/ModalBody';
import ModalFooter from 'rsuite/lib/Modal/ModalFooter';
import ModalTitle from 'rsuite/lib/Modal/ModalTitle';
import AvatarEditor from 'react-avatar-editor';
import { useModalState } from '../../misc/custom-hooks';
import { database, storage } from '../../misc/firebase';
import { useProfile } from '../../context/profile.context';

const fileInputTypes= ".jpg,.jpeg,.png";

const acceptedFileTypes = ['image/png','image/pjpeg','image/jpeg'];  // acceptable MIME/media types

const getBlob = (canvas) => {
    return new Promise((resolve,reject)=>{
        canvas.toBlob((blob)=>{
            if(blob)
            {
                resolve(blob);
            }
            else
            {
                reject(new Error('File processing error.. Try re-uploading...'));
            }
        });
    });
}

// eslint-disable-next-line 

const AvatarUploadBtn = () => {
const {isOpen, open , close} = useModalState();
const {profile} = useProfile();
const [img, setImg] = useState(null);
const [isLoading, setIsLoading]= useState(false);
const AvatarEditorRef = useRef();

const onFileInputChange = (ev) => {
    const currFiles = ev.target.files;
    if(currFiles.length === 1)
    {
        const file= currFiles[0];
        if (acceptedFileTypes.includes(file.type))
        {
            setImg(file);
            open();
        }
        else
        {
            Alert.warning(`Wrong file type: ${file.type}`)
        }
    }
}

const onUploadClick = async () => {
    const canvas = AvatarEditorRef.current.getImageScaledToCanvas();
    // converting canvas to bolb file, a blob file stores data in binary format 
    setIsLoading(true);
    try{
        
        const blob= await getBlob(canvas);
        
        const avatarFileRef =  storage.ref(`/profile/${profile.uid}`).child('avatar');
        const uploadAvatarResult =await avatarFileRef.put(blob,{
            cacheControl:`public, max-age=${3600*24*3}`
            // max-age seems to be shelf life of avatar inside storage in seconds
        });
        const downloadUrl =  await uploadAvatarResult.ref.getDownloadURL();
        
        const userAvatarRef = database.ref(`/profiles/${profile.uid}`).child('avatar');
        
        userAvatarRef.set(downloadUrl);
        setIsLoading(false);
        
        Alert.info('Avatar successfully uploaded !', 2000);
    }
    catch(err)
    {
        setIsLoading(false);
        Alert.error(err.message, 2000);
    }
};

  return (
    <div className='mt-3 text-center'>
        <div>
            <label htmlFor="avatar-upload" className='d-block cursor-pointer padded'>
            Select new Avatar
            <input type="file" className="d-none" id="avatar-upload" accept={fileInputTypes} onChange={onFileInputChange}/>
            </label>

            <Modal show={isOpen} onHide={close}>
                <Modal.Header>
                    <ModalTitle>
                        Adjust and upload your Avatar !
                    </ModalTitle>
                </Modal.Header>
                <ModalBody>
                    <div className='d-flex justify-content-center align-items-center h-100'>
                    {img &&
                    <AvatarEditor
                    ref={AvatarEditorRef}
                    image={img}
                    width={200}
                    height={200}
                    border={10}
                    borderRadius={100}
                    rotate={0}
                  />
                  }
                  </div>
                </ModalBody>
                <ModalFooter>
                    <Button block onClick={onUploadClick} appearance="ghost" disabled={isLoading}>
                        Upload new Avatar
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    </div>
  )
}

export default AvatarUploadBtn;