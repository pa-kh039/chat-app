import React, { useState } from 'react'
import { Alert, Button, Modal } from 'rsuite';
import ModalBody from 'rsuite/lib/Modal/ModalBody';
import ModalFooter from 'rsuite/lib/Modal/ModalFooter';
import ModalTitle from 'rsuite/lib/Modal/ModalTitle';
import AvatarEditor from 'react-avatar-editor';
import { useModalState } from '../../misc/custom-hooks';

const fileInputTypes= ".jpg,.jpeg,.png";

const acceptedFileTypes = ['image/png','image/pjpeg','image/jpeg'];  // acceptable MIME/media types

const AvatarUploadBtn = () => {
const {isOpen, open , close} = useModalState();
// eslint-disable-next-line 
const [img, setImg] = useState(null);

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
                    <Button appearance="ghost">
                        Upload new Avatar
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    </div>
  )
}

export default AvatarUploadBtn;