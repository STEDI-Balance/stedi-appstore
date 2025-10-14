import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Share, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  const [bleCharacteristic, setBleCharacteristic] = useState(0); // what the BLE device is measuring

  const [showOnboarding, setShowOnboarding] = useState(true); // ADDED

  useEffect(() => {
    const getUserName = async () => {
      userName.current = await AsyncStorage.getItem('userName');
      token.current = await AsyncStorage.getItem('sessionToken');
      setShareToken(token.current);
      // console.log('Counter userName', userName.current);
      // console.log('counter token:', token.current);
    };
    getUserName();
  }, []);

  useEffect(() => {
    const redirect = async () => {
      if (currentScreen === 'counter') {
        if (completionCount === 1) {
          setCurrentScreen('break');
        } else if (completionCount === 2) {
          await getResults();
          setCurrentScreen('result');
        }
      }
    };
    redirect();
  }, [completionCount]);

  useEffect(() => {
    if (counter > 0) {
      const t = setTimeout(() => {
        if (currentScreen === 'break') {
          if (counter === 1) {
            setCurrentScreen('counter');
            setStepCount(0);
          }
          setCounter(prev => prev - 1);
        }
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [counter, currentScreen]);

  const clockify = () => {
    let hours = Math.floor(counter / 60 / 60);
    let minutes = Math.floor((counter / 60) % 60);
    let seconds = Math.floor(counter % 60);

    let displayHours = hours < 10 ? `0${hours}` : hours;
    let displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    let displaySeconds = seconds < 10 ? `0${seconds}` : seconds;
    return { displayHours, displayMinutes, displaySeconds };
  };

  const customer = useRef();
  const startTime = useRef(0);
  const stopTime = useRef(0);
  const testTime = useRef(0);
  const token = useRef("");
  const userName = useRef("");

  const savingSteps = async () => {
    const lastStep = steps.current[29];
    const firstStep = steps.current[0];
    stopTime.current = lastStep.time;
    testTime.current = lastStep.time - firstStep.time;

    let previousTime = startTime.current;
    const stepPoints = [];
    steps.current.forEach(stepObject => {
      const stepTime = stepObject.time - previousTime;
      previousTime = stepObject.time;
      stepPoints.push(stepTime);
    });

    try {
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
      });
    } catch (error) {
      console.log('save error', error);
    }
  };

  const getResults = async () => {
    try {
      const scoreResponse = await fetch('https://dev.stedi.me/riskscore/' + userName.current, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'suresteps.session.token': token.current
        }
      });
      const scoreObject = await scoreResponse.json();
      setScore(scoreObject.score);
    } catch (error) {
      console.log('score error', error);
    }
  };

  const outcome = () => {
    if (score >= 10) return 'Excellent improvement';
    if (score > 0 && score < 10) return 'Some improvement';
    if (score < 0 && score > -10) return 'Noticeable deterioration';
    if (score <= -10) return 'Severe deterioration';
    return '';
  };

  const messageOutcome = () => {
    if (score >= 10) return 'maintain your progress through regular exercise.*';
    if (score > 0 && score < 10) return 'increase your progress through regular exercise.*';
    if (score < 0 && score > -10) return 'make progress through regular exercise.*';
    if (score <= -10) return 'make a comeback through regular exercise.*';
    return '';
  };

  const close = () => {
    setCompletionCount(0);
    setCurrentScreen('counter');
    setStepCount(0);
    setCounter(180);
  };

  const shareProgress = async () => {
    try {
      await Share.share({ message: 'This is a test' });
    } catch (error) {
      console.log('Error', error);
    }
  };

  const data = useRef({ x: 0, y: 0, z: 0 });

  const [subscription, setSubscription] = useState(null);
  const recentAccelerationData = useRef([]);
  const steps = useRef([]);
  const [stepCount, setStepCount] = useState(0);
  let stepDone = useRef(true); // used in BleCounter to track completed steps

  const _subscribe = () => {
    setSubscription(true);
    startTime.current = new Date().getTime();
    setStepCount(0);
    recentAccelerationData.current = [];
    steps.current = [];
  };

  const tallyLatestSteps = async () => {
    steps.current = steps.current.concat([{ time: new Date().getTime() }]);
    if (steps.current.length >= 30) {
      setStepCount(0);
      await savingSteps();
      _unsubscribe();
      setCompletionCount(prev => prev + 1);
    } else {
      setStepCount(steps.current.length);
    }
  };

  const _unsubscribe = () => {
    subscription && setSubscription(false);
    setSubscription(null);
  };

  // function to check if a new step has been taken
  const { checkNewStep } = BleCounter({ stepDone, tallyLatestSteps, bleCharacteristic });

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

  if (currentScreen === 'counter') {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={styles.screen}>
          {/* Onboarding modal over the Counter */}
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

            {/* BLE status */}
            <Text style={styles.bleText}>BLE characteristic: {bleCharacteristic}</Text>

            {/* Removed accidental render of a function: {checkNewStep} */}

            <TouchableOpacity onPress={_unsubscribe} style={styles.cancelButton}>
              <Icon name={'close-circle'} color='red' size={45} />
            </TouchableOpacity>

            <Image source={exerciseImg} style={styles.image} />

            <Card.Actions>
              <TouchableOpacity onPress={subscription ? _unsubscribe : _subscribe} style={styles.button}>
                <Text style={styles.buttonLabel}>{subscription ? 'Stop' : 'Go'}</Text>
              </TouchableOpacity>
            </Card.Actions>

            {/* Responsive progress bar with safe padding */}
            <View style={styles.progressWrap}>
              <ProgressBar
                progress={(stepCount * 0.50 / 30) + (completionCount * 0.50)}
                width={null}
                height={20}
                color={'#A0CE4E'}
                borderRadius={10}
              />
            </View>
          </Card>
        </View>
      </SafeAreaView>
    );
  } else if (currentScreen === 'break') {
    const { displayMinutes, displaySeconds } = clockify();
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={styles.screen}>
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.breakTitleText}>Relax while you can, next set starts in</Title>
              <Paragraph style={styles.breakTitleText}>{`${displayMinutes}:${displaySeconds}`}</Paragraph>
            </Card.Content>
            <Image source={exerciseImg} style={styles.image} />
          </Card>
        </View>
      </SafeAreaView>
    );
  } else if (currentScreen === 'result') {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={styles.screen}>
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.resultText}>Test Result</Title>
              <Paragraph style={styles.resultText}>{score}</Paragraph>
            </Card.Content>

            <Card.Actions>
              <TouchableOpacity onPress={shareProgress} style={styles.shareButton}>
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
              <Indicator fixValue />
              <DangerPath />
            </Speedometer>

            <TouchableOpacity onPress={() => Linking.openURL('https://stedi.me')} style={styles.visitSiteButton}>
              <Text style={styles.buttonLabel}>Visit Site</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={close} style={styles.closeButton}>
              <Text style={styles.buttonLabel}>Close</Text>
            </TouchableOpacity>
          </Card>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FB' },

  screen: {
    flex: 1,
    justifyContent: 'center',
    padding: 10, // gives ProgressBar room on small screens
    backgroundColor: '#F5F7FB'
  },

  card: {
    borderRadius: 15,
    padding: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2
  },

  titleText: { fontSize: 24, textAlign: 'center', marginVertical: 10 },
  breakTitleText: { fontSize: 20, textAlign: 'center', marginVertical: 10 },
  resultText: { fontSize: 24, textAlign: 'center', marginVertical: 10 },

  bleText: { alignSelf: 'center', color: '#334B61' },

  cancelButton: { alignSelf: 'center', margin: 10 },

  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginVertical: 20
  },

  button: {
    alignSelf: 'center',
    backgroundColor: '#A0CE4E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5
  },
  buttonLabel: { color: 'white', fontSize: 20 },

  progressWrap: {
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'center'
  },

  shareButton: { alignSelf: 'center', marginVertical: 10 },

  visitSiteButton: {
    alignSelf: 'center',
    backgroundColor: '#A0CE4E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 20
  },
  closeButton: {
    alignSelf: 'center',
    backgroundColor: '#A0CE4E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 20
  }
});
