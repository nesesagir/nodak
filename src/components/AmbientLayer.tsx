import { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSettings } from '../settings/SettingsContext';
import type { AmbientKind } from '../settings/themes';

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  rotate: number;
};

function Motif({ kind, size }: { kind: AmbientKind; size: number }) {
  if (kind === 'embers') {
    return (
      <View style={{ width: size, height: size * 1.5, alignItems: 'center' }}>
        <View
          style={{
            width: size * 0.55,
            height: size * 1.15,
            borderRadius: size,
            backgroundColor: '#E07846',
            opacity: 0.9,
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: size * 0.15,
            width: size * 0.28,
            height: size * 0.45,
            borderRadius: size,
            backgroundColor: '#F0C27A',
            opacity: 0.85,
          }}
        />
      </View>
    );
  }

  if (kind === 'petals') {
    return (
      <View style={{ width: size, height: size }}>
        {[0, 72, 144, 216, 288].map((deg) => (
          <View
            key={deg}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              alignItems: 'center',
              transform: [{ rotate: `${deg}deg` }],
            }}
          >
            <View
              style={{
                width: size * 0.34,
                height: size * 0.48,
                marginTop: size * 0.04,
                borderRadius: size,
                backgroundColor: '#E4A0BC',
              }}
            />
          </View>
        ))}
        <View
          style={{
            position: 'absolute',
            left: size * 0.34,
            top: size * 0.34,
            width: size * 0.32,
            height: size * 0.32,
            borderRadius: size,
            backgroundColor: '#F3D9A0',
          }}
        />
      </View>
    );
  }

  if (kind === 'dust') {
    return (
      <View
        style={{
          width: size * 1.2,
          height: size * 0.45,
          borderRadius: 2,
          backgroundColor: '#B08968',
          borderBottomWidth: 2,
          borderBottomColor: '#8B6A4A',
          transform: [{ rotate: '-18deg' }],
        }}
      />
    );
  }

  if (kind === 'drift') {
    return (
      <View style={{ width: size * 2.2, height: size * 0.55, justifyContent: 'center' }}>
        <View
          style={{
            height: 2,
            width: '100%',
            borderRadius: 2,
            backgroundColor: 'rgba(125,184,164,0.85)',
          }}
        />
        <View
          style={{
            marginTop: 3,
            height: 1.5,
            width: '70%',
            borderRadius: 2,
            backgroundColor: 'rgba(125,184,164,0.45)',
          }}
        />
      </View>
    );
  }

  if (kind === 'sparkle') {
    return (
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <View
          style={{
            width: size * 0.55,
            height: size * 0.55,
            backgroundColor: 'rgba(150,210,235,0.9)',
            transform: [{ rotate: '45deg' }],
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.8)',
          }}
        />
        <View
          style={{
            position: 'absolute',
            width: 2,
            height: size,
            backgroundColor: 'rgba(220,240,250,0.7)',
            borderRadius: 1,
          }}
        />
        <View
          style={{
            position: 'absolute',
            width: size,
            height: 2,
            backgroundColor: 'rgba(220,240,250,0.7)',
            borderRadius: 1,
          }}
        />
      </View>
    );
  }

  if (kind === 'stars') {
    return (
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <View
          style={{
            position: 'absolute',
            width: 2,
            height: size,
            borderRadius: 1,
            backgroundColor: '#F2F6FA',
          }}
        />
        <View
          style={{
            position: 'absolute',
            width: size,
            height: 2,
            borderRadius: 1,
            backgroundColor: '#F2F6FA',
          }}
        />
        <View
          style={{
            position: 'absolute',
            width: size * 0.55,
            height: 2,
            borderRadius: 1,
            backgroundColor: '#F2F6FA',
            transform: [{ rotate: '45deg' }],
          }}
        />
        <View
          style={{
            position: 'absolute',
            width: size * 0.55,
            height: 2,
            borderRadius: 1,
            backgroundColor: '#F2F6FA',
            transform: [{ rotate: '-45deg' }],
          }}
        />
      </View>
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#9BB5B0',
      }}
    />
  );
}

function AmbientDot({
  particle,
  kind,
}: {
  particle: Particle;
  kind: AmbientKind;
}) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progress.setValue(0);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(particle.delay),
        Animated.timing(progress, {
          toValue: 1,
          duration: particle.duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: particle.duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [particle.delay, particle.duration, progress]);

  const opacity = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.2, 0.9, 0.2],
  });

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange:
      kind === 'embers'
        ? [16, -56]
        : kind === 'petals'
          ? [-8, 40]
          : kind === 'dust'
            ? [0, 22]
            : [4, -16],
  });

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange:
      kind === 'drift'
        ? [-30, 60]
        : kind === 'embers'
          ? [-8, 10]
          : kind === 'petals'
            ? [-12, 28]
            : [-6, 8],
  });

  const spin = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [`${particle.rotate}deg`, `${particle.rotate + (kind === 'petals' || kind === 'dust' ? 50 : 12)}deg`],
  });

  const scale = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: kind === 'stars' || kind === 'sparkle' ? [0.65, 1.25, 0.65] : [0.85, 1.1, 0.9],
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          left: particle.x,
          top: particle.y,
          opacity,
          transform: [
            { translateX },
            { translateY },
            { rotate: spin },
            { scale },
          ],
        },
      ]}
    >
      <Motif kind={kind} size={particle.size} />
    </Animated.View>
  );
}

export function AmbientLayer() {
  const { theme } = useSettings();
  const { width, height } = useWindowDimensions();

  const particles = useMemo(() => {
    if (theme.ambient === 'none' || width < 1 || height < 1) return [];
    const count = theme.ambient === 'drift' ? 6 : 7;
    return Array.from({ length: count }, (_, i) => {
      const size =
        theme.ambient === 'embers'
          ? 14
          : theme.ambient === 'petals'
            ? 16
            : theme.ambient === 'dust'
              ? 12
              : theme.ambient === 'drift'
                ? 14
                : theme.ambient === 'stars'
                  ? 12
                  : 13;
      return {
        id: i,
        x: (width * (6 + ((i * 13) % 82))) / 100,
        y: (height * (8 + ((i * 17) % 74))) / 100,
        size,
        delay: (i % 4) * 320,
        duration: 2800 + i * 200,
        rotate: (i * 27) % 360,
      } satisfies Particle;
    });
  }, [theme.ambient, theme.id, width, height]);

  if (theme.ambient === 'none' || particles.length === 0) return null;

  return (
    <View style={[styles.layer, { width, height }]} pointerEvents="none">
      {particles.map((p) => (
        <AmbientDot key={`${theme.id}-${p.id}`} particle={p} kind={theme.ambient} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
    elevation: 2,
  },
  dot: {
    position: 'absolute',
  },
});
