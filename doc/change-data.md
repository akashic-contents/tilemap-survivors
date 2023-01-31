# データの書き換え
ソースコードを書き換えずデータのみを書き換えてゲームの内容自体を変えてしまうことも可能です。
ここではデータ書き換えの例を記載していきます。

## 事前準備
Akashic ゲームの実行・開発には、Node.js のインストールなど事前準備が必要です。初めての方は [こちら](https://akashic-games.github.io/shin-ichiba/install.html) を参照してください。

### ゲームのビルド
このゲームはそのままでは実行することができないので、以下のようなコマンドをこのリポジトリで実行してビルドする必要があります。

```
npm install
npm run build
```

また、`npm start` を実行後、`http://localhost:3000` をブラウザで開くと改造前の状態のゲームを遊ぶことができます。

## マップ変更
このゲームでは以下の画像をベースにマップを作成しています。  
![マップ画像](../image/autotile1.png)

マップデータを[こちらのテキストファイル](../text/field_001.json)に記載しています。マップデータの数値は上記画像の描画箇所を表しています。具体的に次のように描画箇所と数字が対応しています。

![マップ画像](autotile1_number.png)

そのため、0~4の値で別のマップに書き換えることが可能です。例えば、以下のような手順でマップを[`doc/text/field_002.json`](text/field_002.json)のマップに書き換えることができます。

1. [`doc/text/field_002.json`](text/field_002.json)をtextディレクトリに置いて`field_001.json`にリネームする
2. `npm run update` を実行して書き換えを反映させる
3. `npm start` を実行してゲームを起動する

## ゲームステージ情報書き換え
このゲームでは、ゲームステージの情報を[stages.json](../text/stages.json)に記載しています。
このファイルを書き換えることで、マップ画像や敵・アイテムの出現タイミング等を変更することが可能です。
stages.jsonに書き込む各プロパティの意味は[Stage.ts](../src/types/Stage.ts)を参照していただければ分かるかと思います。

### 出現するキャラクターの変更
出現する敵キャラクターを変更する場合は、以下の例のように[stages.json](../text/stages.json)の `enemies` 配列中の任意要素の `id` を書き換えます。
利用できる `id` は [characters.json](../text/characters.json)に記載されているキー名のみです。
```json
        "enemies": [
            {
-               "id": "enemy1",
+               "id": "enemy2",
                "time": 100,
                "relativeOffset": { "x": 150, "y": 150 },
                "count": 2
            },
            ...
        ]
```

### 敵の出現タイミング変更
敵キャラクターの出現タイミングを変更する場合は、以下の例のように[stages.json](../text/stages.json)の `enemies` 配列中の任意要素の `time` を書き換えます。
`time` の単位はフレーム数です。また、`enemies` 配列は `time` の小さい順に並べる前提になっているため、`time`が後ろの要素より大きい値になった場合は、その後ろの要素の後ろに並べ直す必要があります。
```json
        "enemies": [
            {
                "id": "enemy1",
-               "time": 100,
+               "time": 130,
                "relativeOffset": { "x": 150, "y": 150 },
                "count": 2
            },
            ...
        ]
```

### 敵の出現場所変更
敵キャラクターの出現場所を変更する場合は、以下の例のように[stages.json](../text/stages.json)の `enemies` 配列中の任意要素の `relativeOffset` を書き換えます。
`relativeOffset`の`x`, `y`はプレイヤーキャラクターを原点とするx,y座標を意味していて、`{ "x": 150, "y": 150 }`であればプレイヤーキャラクターに対して(150, 150)程離れた位置に敵が出現することになります。
```json
        "enemies": [
            {
                "id": "enemy1",
                "time": 100,
-               "relativeOffset": { "x": 150, "y": 150 },
+               "relativeOffset": { "x": 50, "y": 50 },
                "count": 2
            },
            ...
        ]
```

### 敵の出現個数変更
敵キャラクターの出現個数を変更する場合は、以下の例のように[stages.json](../text/stages.json)の `enemies` 配列中の任意要素の `count` を書き換えます。
```json
        "enemies": [
            {
                "id": "enemy1",
                "time": 100,
                "relativeOffset": { "x": 150, "y": 150 },
-               "count": 2
+               "count": 10
            },
            ...
        ]
```

### 敵の出現イベント追加
敵キャラクターの出現イベントを追加する場合は、以下の例のように[stages.json](../text/stages.json)の `enemies` 配列に要素を追加します。
ただし `enemies` 配列は `time` の小さい順に並べる前提になっているため、要素追加時も `time` 順に並べる必要があります。
```json
        "enemies": [
            {
                "id": "enemy1",
                "time": 100,
                "relativeOffset": { "x": 150, "y": 150 },
                "count": 2
            },
+           {
+               "id": "enemy2",
+               "time": 130,
+               "relativeOffset": { "x": 50, "y": 50 },
+               "count": 10
+           },
            ...
        ]
```

### 出現するアイテムの変更
出現するアイテムを変更する場合は、以下の例のように[stages.json](../text/stages.json)の `items` 配列中の任意要素の `id` を書き換えます。
利用できる `id` は [items.json](../text/items.json)に記載されているキー名のみです。
```json
        "items": [
            {
-               "id": "shotup",
+               "id": "scoreup1",
                "time": 50,
                "relativeOffset": { "x": 0, "y": 50 },
                "count": 3
            },
            ...
        ]
```

### アイテムの出現タイミング変更
アイテムの出現タイミングを変更する場合は、以下の例のように[stages.json](../text/stages.json)の `items` 配列中の任意要素の `time` を書き換えます。
`time` の単位はフレーム数です。また、`items` 配列は `time` の小さい順に並べる前提になっているため、`time`が後ろの要素より大きい値になった場合は、その後ろの要素の後ろに並べ直す必要があります。
```json
        "items": [
            {
                "id": "shotup",
-               "time": 50,
+               "time": 60,
                "relativeOffset": { "x": 0, "y": 50 },
                "count": 3
            },
            ...
        ]
```

### アイテムの出現場所変更
アイテムの出現場所を変更する場合は、以下の例のように[stages.json](../text/stages.json)の `items` 配列中の任意要素の `relativeOffset` を書き換えます。
`relativeOffset`の`x`, `y`はプレイヤーキャラクターを原点とするx,y座標を意味していて、`{ "x": 150, "y": 150 }`であればプレイヤーキャラクターに対して(150, 150)程離れた位置にアイテムが出現することになります。
```json
        "items": [
            {
                "id": "shotup",
                "time": 50,
-               "relativeOffset": { "x": 0, "y": 50 },
+               "relativeOffset": { "x": 50, "y": 0 },
                "count": 3
            },
            ...
        ]
```

### アイテムの出現個数変更
アイテムの出現個数を変更する場合は、以下の例のように[stages.json](../text/stages.json)の `items` 配列中の任意要素の `count` を書き換えます。
```json
        "items": [
            {
                "id": "shotup",
                "time": 50,
                "relativeOffset": { "x": 0, "y": 50 },
-               "count": 3
+               "count": 10
            },
            ...
        ]
```

### アイテムの出現イベント追加
アイテムの出現イベントを追加する場合は、以下の例のように[stages.json](../text/stages.json)の `items` 配列に要素を追加します。
ただし `items` 配列は `time` の小さい順に並べる前提になっているため、要素追加時も `time` 順に並べる必要があります。
```json
        "enemies": [
            {
                "id": "shotup",
                "time": 50,
                "relativeOffset": { "x": 0, "y": 50 },
                "count": 3
            },
+           {
+               "id": "scoreup1",
+               "time": 60,
+               "relativeOffset": { "x": 50, "y": 0 },
+               "count": 10
+           },
            ...
        ]
```

## 新規キャラクターの追加
このゲームでは、プレイヤーキャラクターを含む全キャラクターの情報を[characters.json](../text/characters.json)に記載しています。
新規キャラクターの情報をcharacters.jsonに追加して、追加されたキャラクターを出現させるようにstages.jsonを書き換えれば、その新規キャラクターが敵としてステージ上に出現します。
character.jsonに書き込む各プロパティの意味は[Character.ts](../src/types/Character.ts)を参照していただければ分かるかと思います。

以下では新しい敵キャラクターを追加する例を記載しています。
1. [`doc/image/character7.png`](image/character7.png)をimageディレクトリに置く
2. [characters.json](../text/characters.json)に以下の記述を追加する
```json
    "enemy2": {
        "assetId": "character1",
        "name": "兵士",
        "status": {
            "hp": 100,
            "attack": 30,
            "defence": 15,
            "speed": 12,
            "critical": 0
        }
+   },
+   "new_enemy": {
+       "assetId": "character7",
+       "name": "ダーク犬",
+       "status": {
+           "hp": 100,
+           "attack": 25,
+           "defence": 25,
+           "speed": 25,
+           "critical": 0
+       }
    }
```
3. 新規追加したキャラを[stages.json](../text/stages.json)を編集して反映する。反映方法については、前述した「出現するキャラクターの変更」もしくは「敵の出現イベント追加」を参照
4. `npm run update` を実行して書き換えを反映させる
5. `npm start` を実行してゲームを起動する

## 新規アイテムの追加
このゲームでは、全アイテムの情報を[items.json](../text/items.json)に記載しています。
新規アイテムの情報をitems.jsonに追加して、追加されたアイテムを出現させるようにstages.jsonを書き換えれば、その新規アイテムがステージ上に出現します。
items.jsonに書き込む各プロパティの意味は[Item.ts](../src/types/Item.ts)を参照していただければ分かるかと思います。

以下では新しいアイテムを追加する例を記載しています。
1. [`doc/image/c_32.png`](image/c_32.png)をimageディレクトリに置く
2. [items.json](../text/items.json)に以下の記述を追加する
```json
    "shotup": {
        "type": "weapon",
        "assetId": "shotup",
        "name": "エネルギー弾",
        "describe": "前方に向かってエネルギー弾を発射します",
        "weaponId": "shot"
+   },
+   "speedup": {
+       "type": "powerup",
+       "assetId": "c_32",
+       "name": "スピードアップ",
+       "describe": "プレイヤーキャラクターのスピードを15上昇させます",
+       "attack": 0,
+       "defence": 0,
+       "speed": 15,
+       "critical": 0
    }
```
3. 新規追加したアイテムを[stages.json](../text/stages.json)を編集して反映する。反映方法については、前述した「出現するアイテムの変更」もしくは「アイテムの出現イベント追加」を参照
4. `npm run update` を実行して書き換えを反映させる
5. `npm start` を実行してゲームを起動する

## ゲームの公開方法
データを書き換えたものをニコ生ゲームとして公開することができます。公開方法については以下のURLを参照してください。
https://akashic-games.github.io/shin-ichiba/submit.html
