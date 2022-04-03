import { createElement } from 'rax';
import View from 'rax-view';

import './Notice.less';

export default function Notice(props: { show: boolean; text: string; onConfirm: Function; inputs?: string }) {
  const { show, text, onConfirm, inputs } = props;
  return (
    <View className="Notice" style={{ display: show ? 'flex' : 'none' }}>
      {/* <View className="icon-container">
        <View className="icon" style={{ backgroundImage: `url('${process.env.PUBLIC_URL}/assets/loading.png')` }} />
      </View> */}
      <View className="notice-text">{text}</View>
      <input
        className="notice-inputs"
        value={inputs}
        onClick={(e) => {
          e.target.select();
          document.execCommand('copy');
        }}
        onInput={(e) => {
          e.target.value = inputs;
        }}
      />
      <View className="control-btn" onClick={onConfirm}>
        OK
      </View>
    </View>
  );
}
