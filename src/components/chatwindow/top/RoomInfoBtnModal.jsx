import React from 'react'
import { Button, Modal } from 'rsuite';
import { useCurrentRoom } from '../../../context/current-room.context'
import { useModalState } from '../../../misc/custom-hooks';

const RoomInfoBtnModal = () => {

    const description = useCurrentRoom(v=>{return v.description;});
    const name = useCurrentRoom(v=>v.name);
    const {isOpen , open ,close}= useModalState();
    // console.log(description)
  return (
    <>
        <Button appearance='link' className='px-0' onClick={open}>Room INFO</Button>
        <Modal show={isOpen} onHide={close}>
            <Modal.Header>
                <Modal.Title>
                    Group Name : {name}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body><h6 className='mb-1'>Description:</h6>
                <p>{description}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button block onClick={close}>Close description</Button>
            </Modal.Footer>
        </Modal>

    </>
  )
}

export default RoomInfoBtnModal