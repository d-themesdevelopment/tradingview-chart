import { colorsPalette, isHexColor, generateColor, alphaToTransparency, parseRgb, rgbToHexString, shiftRgb, parseRgba, rgbaToString, shiftRgba } from 'some-module';
import { isStudy, studyColorRotationMode, useSameColorRotationComparator } from 'another-module';

class StudyColorRotatorFactory {
  constructor(chartModel) {
    this._chartModel = chartModel;
  }

  getColorRotator(study) {
    const colorRotationMode = studyColorRotationMode(study);
    if (colorRotationMode === null) return null;
    
    const defaultColorsOffset = this._calculateDefaultColorsOffset(study);

    switch (colorRotationMode) {
      case 'loop':
        return new ColorRotatorLoop(defaultColorsOffset);
      case 'shift':
        const startOffset = this._chartModel.getStudyShiftColorStartOffset();
        return new ColorRotatorShift(defaultColorsOffset, startOffset);
    }
  }

  _calculateDefaultColorsOffset(study) {
    let offset = 0;
    const sameColorRotationComparator = useSameColorRotationComparator(study);
    
    this._chartModel.dataSources().filter(isStudy).forEach((dataSource) => {
      if (sameColorRotationComparator(study, dataSource.metaInfo())) {
        offset++;
      }
    });

    return offset;
  }
}

class ColorRotatorLoop {
  constructor(offset) {
    this._offset = offset;
  }

  getColor(color) {
    if (this._offset === 0) return color;
    
    const colorIndex = (this._offset - 1) % colorsPalette.length;
    const colorName = colorsPalette[colorIndex];
    const colorPalette = colorsPalette[colorName];
    const transparency = isHexColor(color) ? 1 : parseRgba(color)[3];
    
    return generateColor(colorPalette, alphaToTransparency(transparency));
  }
}

class ColorRotatorShift {
  constructor(offset, modelStartOffset) {
    this._offset = offset;
    this._modelStartOffset = modelStartOffset;
  }

  getColor(color) {
    if (isHexColor(color)) {
      const rgb = parseRgb(color);
      const shiftedRgb = shiftRgb(rgb, this._offset, this._modelStartOffset);
      return rgbToHexString(shiftedRgb);
    } else {
      const rgba = parseRgba(color);
      const shiftedRgba = shiftRgba(rgba, this._offset, this._modelStartOffset);
      return rgbaToString(shiftedRgba);
    }
  }
}

export { StudyColorRotatorFactory };
