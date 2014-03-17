/**
 *  アニメーション関数
 *  @param target 対象オブジェクト(nodeのstyleなど)
 *  @param properties プロパティの定義
 *  @param options アニメーションのオプション(省略可)
 */
function MiniTweener(target, properties, options){
  // 入れ物となるオブジェクトを用意
  var item = {};
  item.target = target;
  item.properties = properties;
  item.options = options || {};
  // プロパティの入れ物も用意
  item.props = [];
  for (var name in properties){
    // 各プロパティをオブジェクトにまとめ直して配列に挿入
    // プロパティごとに初期値と最終値、接頭辞、接尾辞を持つ
    var prop = properties[name];
    item.props.push({
      name    :name,
      from    :prop.from,
      to      :prop.to,
      distance:prop.to - prop.from,
      prefix  :prop.prefix || '',
      suffix  :prop.suffix || 'px'
    });
  }
  // アニメーションのオプション定義
  item.duration = item.options.duration || 1000;
  item.easing = item.options.easing || MiniTweener.easing;
  item.onComplete = item.options.onComplete;
  // 開始時刻
  item.begin = new Date() - 0;
  // アニメーションの定義セットを配列に入れる
  MiniTweener.Items.push(item);
  if (!MiniTweener.timerId){
    // アニメーションが開始していなければ開始
    MiniTweener.start();
  }
  return item;
}
MiniTweener.easing = function(time, from, dist, duration){
  return dist * time / duration + from;
};
MiniTweener.FPS = 60;
MiniTweener.Items = [];
MiniTweener.loop = function(){
  var items = MiniTweener.Items;
  var now  = new Date() - 0; // 現在時刻
  var time;
  var n = items.length;
  // アニメーションが終了した時に定義を配列から削除するので、
  // 削除しても添え字に影響が出ないように配列を後ろから走査する
  while (n--){
    var item = items[n];
    // 経過時刻
    time = now - item.begin;
    if (time < item.duration){
      // 各プロパティの途中経過を求め、反映
      for(var i = 0; i < item.props.length;i++){
        var prop = item.props[i];
        var current = item.easing(time, prop.from,
                      prop.distance, item.duration);
        item.target[prop.name] = prop.prefix +
                                 current + prop.suffix;
      }
    } else {
      // 最終的な値を設定
      for(var i = 0; i < item.props.length;i++){
        var prop = item.props[i];
        item.target[prop.name] = prop.prefix +
                                 prop.to + prop.suffix;
      }
      // 終了後のコールバック
      if (item.onComplete){
        item.onComplete();
      }
      // 配列から削除
      items.splice(n, 1);
    }
  }
  if (!items.length){
    // アニメーション定義が空になっていたら停止
    MiniTweener.end();
  }
};
MiniTweener.start = function(){
  // TimerのIDを格納しておく
  MiniTweener.timerId = setInterval(MiniTweener.loop,
                        1000 / MiniTweener.FPS);
};
MiniTweener.end = function(){
  MiniTweener.Items = [];
  // タイマーを停止
  clearInterval(MiniTweener.timerId);
  delete MiniTweener.timerId;
};
