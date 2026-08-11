import { useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { spacing } from '../theme/tokens';
import { useGame, isSamePos } from '../game/GameContext';
import { useAppColors } from '../theme/useAppColors';
import { Cell } from './Cell';

const MAX_BOARD_EDGE = 440;

export function Board() {
  const {
    board,
    kinds,
    selected,
    selectCell,
    errorCell,
    errorToken,
    clearError,
    size: gridSize,
  } = useGame();
  const colors = useAppColors();
  const { width, height } = useWindowDimensions();

  const cellSize = useMemo(() => {
    const horizontalPad = spacing.lg * 2 + spacing.md * 2;
    const verticalReserve = 280; // top bar + hint + stats + numpad
    const gaps = spacing.xs * (gridSize - 1) + spacing.sm * 2;
    const byWidth = Math.min(width, MAX_BOARD_EDGE) - horizontalPad - gaps;
    const byHeight = Math.min(height - verticalReserve, MAX_BOARD_EDGE) - gaps;
    const edge = Math.max(180, Math.min(byWidth, byHeight));
    return Math.max(28, Math.floor(edge / gridSize));
  }, [width, height, gridSize]);

  return (
    <View
      style={[
        styles.frame,
        {
          backgroundColor: colors.surface,
          borderColor: colors.gridLine,
        },
      ]}
      accessibilityLabel="Nodak tahtası"
    >
      {board.map((row, rowIndex) => (
        <View key={`r-${rowIndex}`} style={styles.row}>
          {row.map((value, colIndex) => {
            const pos = { row: rowIndex, col: colIndex };
            const isError = isSamePos(errorCell, pos);
            return (
              <Cell
                key={`c-${rowIndex}-${colIndex}`}
                value={value}
                kind={kinds[rowIndex][colIndex]}
                selected={isSamePos(selected, pos)}
                isError={isError}
                errorToken={isError ? errorToken : 0}
                size={cellSize}
                onPress={() => selectCell(pos)}
                onErrorDone={clearError}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignSelf: 'center',
    padding: spacing.sm,
    borderRadius: 14,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
  },
});
