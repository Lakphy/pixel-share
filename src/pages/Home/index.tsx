import { createElement, useEffect, useState } from 'rax';
import View from 'rax-view';
import Text from 'rax-text';

import './index.less';
import { colorList, colors } from '@/types/color';
import { DrawingConfigType, initialDrawingConfig } from '@/types/drawing';
import Image from 'rax-image';
import { getParamData, UniversalParamData } from '@/utils/data';
import { getSearchParams } from 'rax-app';
import Loading from '@/components/Loading/Loading';
import Notice from '@/components/Notice/Notice';

export default function Home() {
  const [safeWidth, setSafeWidth] = useState(Math.min(window.innerWidth * 0.96, 800));
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState({ show: false, text: '', inputs: '', handleConfirm: () => {} });
  const [drawingConfig, setDrawingConfig] = useState<DrawingConfigType>(initialDrawingConfig);
  const generateMatrix = (props: DrawingConfigType) => {
    // return new Array(props.matrix * props.matrix).fill({ color: colors.WHITE }).map((item, index) => {
    //   return <View style={{ backgroundColor: colorList[item.color] }} data-index={index} />;
    // });
    return props.drawingMap.map((item, index) => {
      return (
        <View
          style={{
            backgroundColor: colorList[item.color],
            width: `${(safeWidth * 0.67) / props.matrix}px`,
            height: `${(safeWidth * 0.67) / props.matrix}px`,
            margin: `${(safeWidth * 0.05) / props.matrix}px`,
            borderRadius: `${(safeWidth * 0.1) / props.matrix}px`,
          }}
          className="matrix-block"
          data-index={index}
          key={index.toString()}
        />
      );
    });
  };
  const handleChangeBlock = (e) => {
    const operationIndex = parseInt(e.target.dataset.index, 10);
    if ((operationIndex === 0 || operationIndex) && drawingConfig.matrix > 1) {
      if (drawingConfig.editable) {
        setDrawingConfig((prev: DrawingConfigType) => {
          // eslint-disable-next-line prefer-const
          let draftMap = prev.drawingMap;
          draftMap[operationIndex] = { color: drawingConfig.currentColor };
          return { ...prev, draftMap };
        });
      } else {
        return null;
      }
    } else if (operationIndex && drawingConfig.matrix <= 1) {
      setDrawingConfig((prev: DrawingConfigType) => {
        return {
          ...prev,
          matrix: operationIndex,
          drawingMap: new Array(operationIndex * operationIndex).fill(null).map((item, index) => {
            return {
              color: colors.WHITE,
            };
          }),
        };
      });
    } else return null;
    return null;
  };
  const handleChangeCurrentColor = (e) => {
    const operationColor = e.target.dataset.color;
    if (operationColor === 0 || operationColor) {
      setDrawingConfig((prev) => {
        return { ...prev, currentColor: operationColor as colors };
      });
    }
  };
  const handleShare = (e) => {
    if (drawingConfig.matrix <= 1) return;
    const shareData = new UniversalParamData('deed', drawingConfig.drawingMap).encodeParamData();
    console.log(shareData);
    history.pushState({}, '', `#/?x=${shareData}`);
    setNotice((prev) => {
      return {
        ...prev,
        show: true,
        text: 'Your canvas sharing link has been generated, please click the window below to copy.',
        inputs: location.href,
        handleConfirm: () => {
          setNotice((_prev) => {
            return {
              ..._prev,
              show: false,
            };
          });
        },
      };
    });
  };
  useEffect(() => {
    const handleResize = () => {
      setSafeWidth(Math.min(window.innerWidth * 0.96, 800));
    };
    window.addEventListener('resize', handleResize);

    const customParam = getSearchParams();
    // 携带路由参数
    if (customParam.x && customParam.x.length > 0) {
      const paramData = getParamData();
      if (paramData.length >= 16) {
        setDrawingConfig((prev) => {
          return {
            ...prev,
            matrix: parseInt(Math.sqrt(paramData.length).toString(), 10),
            drawingMap: paramData.slice(0, Math.pow(parseInt(Math.sqrt(paramData.length).toString(), 10), 2)),
            editable: false,
            received: true,
          };
        });
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } else {
        // setLoading(false);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    } else {
      // setLoading(false);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <>
      <Loading loading={loading} />
      <Notice show={notice.show} text={notice.text} onConfirm={notice.handleConfirm} inputs={notice.inputs} />
      <View className="safe-view" style={{ width: `${safeWidth}px` }}>
        <View className="matrix-back" style={{ width: `${safeWidth}px`, height: `${safeWidth}px` }} />
        <View
          className="matrix-container"
          style={{ width: `${safeWidth}px`, height: `${safeWidth}px` }}
          onClick={handleChangeBlock}
        >
          {drawingConfig.matrix > 1 ? (
            generateMatrix(drawingConfig)
          ) : (
            <>
              <View className="selector-title">Please select the drawing size:</View>
              {new Array(
                (() => {
                  if (safeWidth < 300) return 7;
                  else if (safeWidth < 340) return 9;
                  else if (safeWidth < 380) return 11;
                  else if (safeWidth < 500) return 14;
                  else if (safeWidth < 585) return 21;
                  else return 25;
                })(),
              )
                .fill(<></>)
                .map((item, index) => {
                  if (index >= 5) {
                    return (
                      <View key={index} className="selector-container" data-index={index}>
                        <View className="selector-back" data-index={index} />
                        <View className="selector" data-index={index}>
                          {index}
                        </View>
                      </View>
                    );
                  } else return null;
                })}
            </>
          )}
        </View>
        <View className="notice">
          {drawingConfig.received
            ? 'You received an awesome pixel art, click "Edit" to release your inspiration, click "Share" to share your canvas with others, click "Clear" to clear the canvas.'
            : ''}
        </View>
        <View className="controls">
          <View
            className="control-btn"
            onClick={() => {
              setDrawingConfig(initialDrawingConfig);
              history.pushState({}, '', '#/');
            }}
          >
            Clear
          </View>
          <View
            className="control-btn"
            onClick={() => {
              setDrawingConfig((prev) => {
                return {
                  ...prev,
                  editable: !prev.editable,
                  received: false,
                };
              });
            }}
          >
            {drawingConfig.editable ? 'Done' : 'Edit'}
          </View>
          <View className="control-btn" onClick={handleShare}>
            Share
          </View>
        </View>
        <View className="color-selector" onClick={handleChangeCurrentColor}>
          {colorList.map((item, index) => {
            return (
              <View className="color-unit" key={index}>
                <View className="color-back" />
                <View className="color-front" style={{ backgroundColor: colorList[index] }} data-color={index}>
                  <img
                    data-color={index}
                    className="color-sign"
                    src={
                      index === 13 ||
                      index === 12 ||
                      index === 11 ||
                      index === 10 ||
                      index === 9 ||
                      index === 1 ||
                      index === 2
                        ? `${process.env.PUBLIC_URL}/assets/pen-white.png`
                        : `${process.env.PUBLIC_URL}/assets/pen-black.png`
                    }
                    style={
                      colorList[drawingConfig.currentColor] === item
                        ? { opacity: 1, transform: 'scale(1)' }
                        : { opacity: 0, transform: 'scale(0.01)' }
                    }
                  />
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </>
  );
}
