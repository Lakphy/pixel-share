import { colors } from '@/types/color';
import { getSearchParams } from 'rax-app';

const dec2BinStr = (dec) => {
  let value = parseInt(dec).toString(2);
  const l = value.length;
  if (l < 4) {
    for (let i = 0; i < 4 - l; i++) {
      value = `0${value}`;
    }
  }
  return value;
};
const binstr2Dec = (bin: string): number => {
  if (bin.length === 4) {
    return parseInt(bin, 2);
  } else return -1;
};

const customCodeList: Array<[string, string]> = [
  ['000000', '0'],
  ['000001', '1'],
  ['000010', '2'],
  ['000011', '3'],
  ['000100', '4'],
  ['000101', '5'],
  ['000110', '6'],
  ['000111', '7'],
  ['001000', '8'],
  ['001001', '9'],
  ['001010', 'a'],
  ['001011', 'b'],
  ['001100', 'c'],
  ['001101', 'd'],
  ['001110', 'e'],
  ['001111', 'f'],
  ['010000', 'g'],
  ['010001', 'h'],
  ['010010', 'i'],
  ['010011', 'j'],
  ['010100', 'k'],
  ['010101', 'l'],
  ['010110', 'm'],
  ['010111', 'n'],
  ['011000', 'o'],
  ['011001', 'p'],
  ['011010', 'q'],
  ['011011', 'r'],
  ['011100', 's'],
  ['011101', 't'],
  ['011110', 'u'],
  ['011111', 'v'],
  ['100000', 'w'],
  ['100001', 'x'],
  ['100010', 'y'],
  ['100011', 'z'],
  ['100100', 'A'],
  ['100101', 'B'],
  ['100110', 'C'],
  ['100111', 'D'],
  ['101000', 'E'],
  ['101001', 'F'],
  ['101010', 'G'],
  ['101011', 'H'],
  ['101100', 'I'],
  ['101101', 'J'],
  ['101110', 'K'],
  ['101111', 'L'],
  ['110000', 'M'],
  ['110001', 'N'],
  ['110010', 'O'],
  ['110011', 'P'],
  ['110100', 'Q'],
  ['110101', 'R'],
  ['110110', 'S'],
  ['110111', 'T'],
  ['111000', 'U'],
  ['111001', 'V'],
  ['111010', 'W'],
  ['111011', 'X'],
  ['111100', 'Y'],
  ['111101', 'Z'],
  ['111110', '*'],
  ['111111', '$'],
];
const encodeMap = new Map(customCodeList);
const decodeMap = new Map(
  customCodeList.map((item): [string, string] => {
    return item.reverse() as [string, string];
  }),
);
const bin2CustomCode = (bin: string) => {
  const binLength = bin.length;
  let binPoint = 0;
  const customCodeStack: string[] = [];
  const binstr = bin + new Array(6 - (binLength % 6)).fill(0).join('');
  while (true) {
    if (binLength - binPoint <= 0) break;
    customCodeStack.push(encodeMap.get(binstr.substring(binPoint, binPoint + 6)) || '');
    binPoint += 6;
  }
  return customCodeStack.join('');
};
const customCode2Bin = (customCode) => {
  const customCodeLength = customCode.length;
  let customCodePoint = 0;
  const binStack: string[] = [];
  while (true) {
    if (customCodeLength - customCodePoint <= 0) break;
    binStack.push(decodeMap.get(customCode.substring(customCodePoint, customCodePoint + 1)) || '');
    customCodePoint += 1;
  }
  return binStack.join('');
};

export class UniversalParamData {
  encodedString: string; // 加密后的数据
  decodedMapData: Array<{ color: colors }>; // 解密后的数据
  codeType: 'ened' | 'deed';
  constructor(codeType: 'ened' | 'deed', paramData: string | Array<{ color: colors }>) {
    this.codeType = codeType;
    switch (codeType) {
      case 'ened':
        if (paramData) this.encodedString = paramData as string;
        break;
      case 'deed':
        if (paramData) this.decodedMapData = paramData as Array<{ color: colors }>;
        break;
      default:
        break;
    }
  }
  decodeParamData() {
    if (this.codeType === 'deed') {
      return null;
    }
    // TODO 解密路由数据
    const draftBinData = customCode2Bin(this.encodedString);
    const draftColorsBinData = draftBinData.substring(2, draftBinData.length);
    let colorsBinPoint = 0;
    const colorsStack: Array<{ color: colors }> = [];
    while (draftColorsBinData.length - colorsBinPoint >= 4) {
      colorsStack.push({ color: binstr2Dec(draftColorsBinData.substring(colorsBinPoint, colorsBinPoint + 4)) });
      colorsBinPoint += 4;
    }
    this.decodedMapData = colorsStack;
    return this.decodedMapData;
  }
  encodeParamData() {
    if (this.codeType === 'ened') {
      return null;
    }
    // 加密路由数据
    const binData = `00${this.decodedMapData
      .map((item, index) => {
        return dec2BinStr(item.color);
      })
      .join('')}`;
    this.encodedString = bin2CustomCode(binData);
    return this.encodedString;
  }
}

export const getParamData = (): Array<{ color: colors }> => {
  const customParam = getSearchParams() as { x: string };
  console.log(customParam);
  if (customParam.x && customParam.x.length > 0) {
    const paramData: UniversalParamData = new UniversalParamData('ened', customParam.x);
    return paramData.decodeParamData() as Array<{ color: colors }>;
  }
  return [];
};
// 测试爱心
// 04g4g4h4h4h4h4h4h4h0h4h004h000100
