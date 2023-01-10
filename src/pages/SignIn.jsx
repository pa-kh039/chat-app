import React from 'react';
import firebase from 'firebase/app';
import { Container, Grid, Row, Col, Panel, Button, Icon, Alert } from 'rsuite';
import { auth, database } from '../misc/firebase';

const SignIn = () => {
    const signInWithProvider = async provider => {
    try {
        const {additionalUserInfo,user} = await auth.signInWithPopup(provider);

        if(additionalUserInfo.isNewUser)
        {
            database.ref(`/profiles/${user.uid}`).set({
                name: user.displayName,
                createdAt: firebase.database.ServerValue.TIMESTAMP
            });
        }
        Alert.success(`Hi ${additionalUserInfo.profile.name}! You have signed in sucessfully !`,2000);
        } 
        catch (error) {
      Alert.error(error.message, 4000);
    //   4000ms ka timer hai in alert
    }
  };

  const onFacebookSignIn = () => {
    signInWithProvider(new firebase.auth.FacebookAuthProvider());
  };
  const onGoogleSignIn = () => {
    signInWithProvider(new firebase.auth.GoogleAuthProvider());
  };

  return (
    <Container>
      {/* the grid component of rsuite is different from grid class of bootstrap, as there are 12 columns in grid of bootstrap where as in rsuite they are 24 */}
      <Grid className="mt-page">
        <Row>
          {/* <Col xs={24} md={12}> with this the heading is centered only for small screens , but not for medium and screens bcoz of 12 col system, so we will apply a 6 col offset to left of it to get it centered */}
          <Col xs={24} md={12} mdOffset={6}>
            {/* 24 columns for extremely small deivces, and 12 for medium and above size devices */}
            <Panel>
              <div className="text-center">
                <h2>Welcome to Chat App</h2>
                <p>Progressive Chat Platform for Techies XD</p>
              </div>
              <div className="mt-3">
                <Button block color="blue" onClick={onFacebookSignIn}>
                  <Icon icon="facebook" /> &nbsp; &nbsp;Sign in with FaceBook
                </Button>
                <Button block color="green" onClick={onGoogleSignIn}>
                  <Icon icon="google" /> &nbsp; &nbsp;Sign in with Google
                </Button>
              </div>
            </Panel>
          </Col>
        </Row>
      </Grid>
    </Container>
  );
};

export default SignIn;
