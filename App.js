import {
  Canvas,
  Circle,
  Path,
  mix,
  Group,
  useSharedValueEffect,
  useTouchHandler,
} from '@shopify/react-native-skia';
import React, {useRef} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import {
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
const {height} = Dimensions.get('window');

const SCLERA_SIZE = 50;
const PUPIL_SIZE = 35;
const LIGHT_SIZE = 8;

function getEyePath(value) {
  return `M 0 150 Q 150 0 300 150 Q 150 ${value} 0 150`;
}

export default function App() {
  const eyeLidAnim = useSharedValue(0.2);
  const eyeAnim = useSharedValue(0.5);

  const canvasRef = useRef(null);
  useSharedValueEffect(canvasRef, eyeLidAnim, eyeAnim);

  const touchHandler = useTouchHandler({
    onEnd: () => {
      eyeLidAnim.value = withSequence(
        withTiming(1, {duration: 300}),
        withTiming(0.2, {duration: 300}),
      );

      eyeAnim.value = withSequence(
        withTiming(0, {duration: 800}),
        withTiming(1, {duration: 800}),
      );
    },
  });

  return (
    <Canvas innerRef={canvasRef} onTouch={touchHandler} style={styles.root}>
      <Group transform={[{translateX: 100}, {translateY: height / 2 - 280}]}>
        <Path
          path="M 0 150 Q 100 0 200 150 Q 100 50 0 150"
          color="rgb(54,64,224)"
        />
      </Group>
      <Group transform={[{translateX: 50}, {translateY: height / 2 - 200}]}>
        <Path path={getEyePath(300)} color="white" />
        <Group
          transform={() => [
            {translateX: mix(eyeAnim.value, 90, 200)},
            {translateY: 150},
          ]}>
          <Circle r={SCLERA_SIZE} color="rgb(48,169,246)" />
          <Circle r={PUPIL_SIZE} color="rgb(18,22,91)" />
          <Circle cx={10} cy={-10} r={LIGHT_SIZE} color="white" />
        </Group>
        <Path
          path={() => getEyePath(mix(eyeLidAnim.value, 0, 300))}
          color="rgb(54,64,224)"
        />
      </Group>
      <Group transform={[{translateX: 100}, {translateY: height / 2}]}>
        <Path
          path="M 200 50 Q 100 200 0 50 Q 100 150 200 50"
          color="rgb(54,64,224)"
        />
      </Group>
    </Canvas>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'rgb(34,110,231)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
    backgroundColor: 'red',
  },
});
