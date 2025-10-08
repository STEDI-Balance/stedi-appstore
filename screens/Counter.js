import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Share, Linking } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import Speedometer, {
  Background, Arc, Needle, Progress, Marks, Indicator, DangerPath
} from 'react-native-cool-speedometer';
import exerciseImg from '../image/exercise2.png';
import ProgressBar from 'react-native-progress/Bar';
import { FontAwesome5 } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ManuallyCounter from '../components/ManuallyCounter';
import BleCounter from '../components/BleCounter';
import DeviceSetupOnboarding from '../components/DeviceSetupOnboarding'; // ADDED

export default function Counter(props) {
  const [completionCount, setCompletionCount] = useState(0);
  const [counter, setCounter] = useState(180); //(180 seconds = 3 minutes)
  const [score, setScore] = useState(0);
  const [currentScreen, setCurrentScreen] = useState('counter');
  const [shareToken, setShareToken] = useState("");
  const [bleCharacteristic, setBleCharacteristic] = useState(0); // variable to keep track of what the BLE device is measuring

  const [showOnboarding, setShowOnboarding] = useState(true); // ADDED

  useEffect(() => {
    const getUserName = async () => {
      userName.current = await AsyncStorage.getItem('userName');
      console.log('Counter userName', userName.current);
      token.current = await AsyncStorage.getItem('sessionToken');
      setShareToken(token.current);
      console.log('counter token:', token.current);
    };
    getUserName();
  }, []);
// Decides where to navigate after completing a set. Either to the result screen or the take a break screen
  useEffect(() => {
    const redirect = async () => {
      if (currentScreen === 'counter') {
        if (completionCount === 1) {
          setCurrentScreen('break');
          console.log('completionCount:', completionCount);
        }
        else if (completionCount === 2) {
          await getResults();
          setCurrentScreen('result');
        }
      }
    }
    redirect();
  }, [completionCount]);
// Break screen timer. Ticks down.
  useEffect(() => {
    counter > 0 && setTimeout(() => {
      if (currentScreen === 'break') {
        if (counter === 1) {
          setCurrentScreen('counter');
          setStepCount(0);
        }
        setCounter(counter - 1);
      }
    }, 1000);
  }, [counter, currentScreen]);
// Converts time to show as HH:MM:SS
  const clockify = () => {
    let hours = Math.floor(counter / 60 / 60);
    let minutes = Math.floor(counter / 60 % 60);
    let seconds = Math.floor(counter % 60);

    let displayHours = hours < 10 ? `0${hours}` : hours;
    let displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    let displaySeconds = seconds < 10 ? `0${seconds}` : seconds;
    return {
      displayHours,
      displayMinutes: displayMinutes,
      displaySeconds,
    };
  };
// ======== REFS (mutable values that persist across renders, not causing re-renders when changed) ========
  const customer = useRef();
  const startTime = useRef(0);
  const stopTime = useRef(0);
  const testTime = useRef(0);
  const token = useRef("");
  const userName = useRef("");
// Saves steps and records time to prepare to add to backend.
  const savingSteps = async (event) => {
    let stepPoints = [];
    const lastStep = steps.current[29];
    const firstStep = steps.current[0];
    stopTime.current = lastStep.time;

    testTime.current = lastStep.time - firstStep.time;

    let previousTime = startTime.current;

    stepPoints = [];
    steps.current.forEach(stepObject => {
      const stepTime = stepObject.time - previousTime;
      previousTime = stepObject.time;
      stepPoints.push(stepTime); ; // Adds data to the array for backend
    });
// Gets the results and attempts to push the data to the backend
    try {
      console.log('token:', token.current);
      await fetch('https://dev.stedi.me/rapidsteptest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'suresteps.session.token': token.current
        },
        body: JSON.stringify({
          customer: userName.current,
          startTime: startTime.current,
          stepPoints,
          stopTime: stopTime.current,
          testTime: testTime.current,
          totalSteps: 30
        })
      })
    }
    catch (error) {
      console.log('save error', error);
    }
  }
//Shows results from the backend.
  const getResults = async () => {
    try {
      console.log('UserName:' + userName.current);
      console.log('Token before calling score:' + token.current);
      const scoreResponse = await fetch('https://dev.stedi.me/riskscore/' + userName.current, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'suresteps.session.token': token.current
        }
      })
      console.log(`Response status: ${scoreResponse.status}`);
      const scoreText = await scoreResponse.text();
      console.log(`Response text: ${scoreText}`)
      const scoreObject = await scoreResponse.json();
      console.log("score:", scoreObject.score);
      setScore(scoreObject.score);

    } catch (error) {
      console.log('score error', error);
    }
  }
// After getting the score from backend displays a message depending on score.
  const outcome = () => {
    if (score >= 10) {
      return ("Excellent improvement")
    } else if (score > 0 && score < 10) {
      return ('Some improvement');
    }
    else if (score < 0 && score > -10) {
      return ('Noticeable deterioration');
    }
    else if (score <= -10) {
      return ("severe deterioration")
    }
  }

  const messageOutcome = () => {
    if (score >= 10) {
      return ("maintain your progress through regular exercise.*")
    } else if (score > 0 && score < 10) {
      return ('increase your progress through regular exercise.*');
    }
    else if (score < 0 && score > -10) {
      return ('make progress through regular exercise.*');
    }
    else if (score <= -10) {
      return ("make a comeback through regular exercise.*")
    }
  }
// Reset set and prepare for new one
  const close = () => {
    setCompletionCount(0);
    setCurrentScreen('counter');
    setStepCount(0);
    setCounter(180);
  }

  const shareProgress = async () => {// Share progress functionallity. Currently not fully implemented.  (From what I can tell lol)
    const shareOptions = {
      message: 'This is a test'
    }
    try {
      const shareResponse = await Share.share(shareOptions)
      console.log(shareResponse);
    }
    catch (error) {
      console.log('Error', error)
    }
  }

  const data = useRef({
    x: 0,
    y: 0,
    z: 0,
  });

  const [subscription, setSubscription] = useState(null);
  const recentAccelerationData = useRef([]);
  const steps = useRef([]);
  const [stepCount, setStepCount] = useState(0);
  let stepDone = useRef(true); //variable used with the BleCounter component to keep track of whether a step has been completed.

  const _subscribe = () => {// begins a set basically.
    setSubscription(true)
    startTime.current = new Date().getTime();
    setStepCount(0);
    recentAccelerationData.current = [];
    steps.current = [];
  };

  const tallyLatestSteps = async () => {// gets the data and sends everything depending on if you are at 30 steps
    steps.current = steps.current.concat([{ time: new Date().getTime() }]);
    if (steps.current.length >= 30) {
      setStepCount(0);
      await savingSteps();
      _unsubscribe();
      setCompletionCount(completionCount + 1);
      console.log('completionCount:', completionCount);
    } else {
      setStepCount(steps.current.length);
    }
  }

  const _unsubscribe = () => {// resets flags
    subscription && setSubscription(false);
    setSubscription(null);
  };

  // function to check if a new step has been taken
  const { checkNewStep } = BleCounter({stepDone, tallyLatestSteps, bleCharacteristic});

  // if the user is subscribed to the BLE characteristic, check for new steps
  if (subscription) {
    bleCharacteristic.onChange = checkNewStep();
  }
    
  useEffect(() => {
    steps.current = [];
    return () => _unsubscribe();
  }, []);

  const { x, y, z } = data.current;
  let total_amount_xyz = Math.sqrt(x * x + y * y + z * z) * 9.81;

  if (currentScreen === 'counter') {// Styles for Counter screen and functionality behind buttons.
    return (
      <View style={styles.screen}>
        {/* ADDED: show onboarding modal over the Counter */}
        {showOnboarding && (
          <DeviceSetupOnboarding
            visible={showOnboarding}
            onFinish={() => setShowOnboarding(false)}
          />
        )}

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.titleText}>Steps</Title>
            <Paragraph style={styles.titleText}>{stepCount}</Paragraph>
          </Card.Content>
          <ManuallyCounter visible={subscription} tallyLatestSteps={tallyLatestSteps} />
          {/* a pop-up modal to prompt the user to connect to a BLE device */}
          <Text>BLE characteristic: {bleCharacteristic}</Text>
          {checkNewStep}
          <TouchableOpacity onPress={_unsubscribe} style={styles.cancelButton} >
            <Icon name={'close-circle'} color='red' size={45} />
          </TouchableOpacity>
          <Image source={exerciseImg} style={styles.image} ></Image>
          <Card.Actions>
            <TouchableOpacity onPress={subscription ? _unsubscribe : _subscribe} style={styles.button}>
              <Text style={{ color: 'white', fontSize: 20 }}>{subscription ? 'Stop' : 'Go'}</Text>
            </TouchableOpacity>
          </Card.Actions>
          <ProgressBar progress={(stepCount * 0.50 / 30) + (completionCount * 0.50)} width={300} height={25} color={'#A0CE4E'} style={{ marginBottom: 20, marginLeft: 30, marginRight: 20, marginTop: 40 }} borderRadius={10} />
        </Card>
      </View>
    );
  }

  else if (currentScreen === 'break') {// Break screen functionality and display.
    const { displayHours, displayMinutes, displaySeconds } = clockify();

    return (
      <View style={styles.screen}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.breakTitleText}>Relax while you can, next set starts in</Title>
            <Paragraph style={styles.breakTitleText}>{`${displayMinutes}:${displaySeconds}`}</Paragraph>
          </Card.Content>
          <Image source={exerciseImg} style={styles.image} ></Image>
        </Card>
      </View>
    );
  }

  else if (currentScreen === 'result') { //result screen functionality and display
    return (
      <View style={styles.screen}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.resultText}>Test Result</Title>
            <Paragraph style={styles.resultText}>{score}</Paragraph>
          </Card.Content>
          <Card.Actions>
            <TouchableOpacity onPress={() => shareProgress()} style={styles.shareButton}>
              <FontAwesome5 name="share-square" size={40} color="red" />
            </TouchableOpacity>
          </Card.Actions>
          <Text style={styles.resultText}>{outcome()}</Text>
          <Speedometer
            value={score}
            fontFamily='squada-one'
            size={200}
            angle={160}
            max={20}
            backgroundColor='transparent'
          >
            <Background angle={180} color="#cbcdd3" />
            <Arc arcWidth={30} />
            <Needle />
            <Progress />
            <Marks step={10} />
            <Indicator  fixValue/>
            <DangerPath />
          </Speedometer>
          <TouchableOpacity onPress={() => Linking.openURL('https://stedi.me')} style={styles.visitSiteButton}>
            <Text style={{ color: 'white', fontSize: 20 }}>Visit Site</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={close} style={styles.closeButton}>
            <Text style={{ color: 'white', fontSize: 20 }}>Close</Text>
          </TouchableOpacity>
        </Card>
      </View>
    );
  }
}
//Styles
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f3'
  },
  card: {
    margin: 10,
    borderRadius: 15,
    padding: 10,
  },
  titleText: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 10,
  },
  breakTitleText: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 10,
  },
  resultText: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 10,
  },
  cancelButton: {
    alignSelf: 'center',
    margin: 10,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginVertical: 20,
  },
  button: {
    alignSelf: 'center',
    backgroundColor: '#A0CE4E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  shareButton: {
    alignSelf: 'center',
    marginVertical: 10,
  },
  visitSiteButton: {
    alignSelf: 'center',
    backgroundColor: '#A0CE4E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 20,
  },
  closeButton: {
    alignSelf: 'center',
    backgroundColor: '#A0CE4E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 20,
  },
});
