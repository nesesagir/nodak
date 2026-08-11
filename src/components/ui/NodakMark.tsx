import { Image, StyleSheet, View } from 'react-native';

type Props = {
  size?: number;
};

export function NodakMark({ size = 22 }: Props) {
  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Image
        source={require('../../../assets/nodak-mark.png')}
        style={{ width: size, height: size }}
        resizeMode="contain"
        accessibilityLabel="Nodak"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 6,
    backgroundColor: '#000000',
  },
});
