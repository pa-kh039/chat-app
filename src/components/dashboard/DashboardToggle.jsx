import React from 'react'
import { Button, Drawer, Icon } from 'rsuite'
import Dashboard from '.';
import { useModalState } from '../../misc/custom-hooks'

const DashboardToggle = () => {

  const { isOpen , close , open } = useModalState();

  return (
    <div>
        <Button block color="blue" onClick={open}>
            <Icon icon="dashboard">dashboard</Icon>
        </Button>
        <Drawer show={isOpen} onHide={close} placement="left">
            <Dashboard/>
        </Drawer>
    </div>
  )
}

export default DashboardToggle