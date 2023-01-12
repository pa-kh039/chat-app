import React from 'react'
import { Button, Drawer, Icon } from 'rsuite'
import Dashboard from '.';
import { useMediaQuery, useModalState } from '../../misc/custom-hooks'

const DashboardToggle = () => {

  const { isOpen , open , close } = useModalState();
  const isMobile= useMediaQuery('(max-width: 992 px)');

  return (
    <div>
        <Button block color="blue" onClick={open}>
            <Icon icon="dashboard">dashboard</Icon>
        </Button>
        <Drawer full={isMobile} show={isOpen} onHide={close} placement="left">
            <Dashboard/>
        </Drawer>
    </div>
  )
}

export default DashboardToggle