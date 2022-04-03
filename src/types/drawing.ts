import { colors } from './color';

export interface DrawingConfigType {
  currentColor: colors;
  matrix: number;
  drawingMap: Array<{ color: colors }>;
  editable: boolean;
  received: boolean;
}

export const initialDrawingConfig: DrawingConfigType = {
  currentColor: colors.BLACK,
  matrix: 1,
  drawingMap: [],
  editable: true,
  received: false,
};
