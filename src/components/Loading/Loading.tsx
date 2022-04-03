import { createElement } from 'rax';
import View from 'rax-view';

import './Loading.less';

export default function Loading(props: { loading: boolean }) {
  return (
    <View className="Loading" style={{ display: props.loading ? 'flex' : 'none' }}>
      <View className="icon-container">
        <View className="icon" style={{ backgroundImage: `url('${process.env.PUBLIC_URL}/assets/loading.png')` }} />
      </View>
      <View className="loading-text">Loading...</View>
    </View>
  );
}
