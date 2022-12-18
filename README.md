# tilemap-survivors
RPG などでおなじみのタイルマップと四方向キャラクタの素材を使ったランキングゲームです。
JavaScriptゲームエンジン [Akashic Engine](https://akashic-games.github.io/)で作成しました。

* ゲームのステージ・難易度はテキストエディタなどで変更することができます。
* プログラミングの経験がない方も、**グラフィックやステージを変えてオリジナルゲームを作る**ことができます。
* 作ったゲームは[ゲーム投稿サイトにアップロードして遊んでもらう](https://akashic-games.github.io/shin-ichiba/submit.html)ことができます。

## ゲーム画面
![ゲーム画面](/img/game_animation.gif)

## 遊び方
画面をタップして犬を操作してハイスコアを目指すゲームです。
「P」という文字のアイテムを拾うとスコアが上昇します。
敵にぶつかるとライフが減り、ライフが0になるとゲームオーバーです。
ゲームオーバーになるとスコアが半減します。

## ゲーム開発者向け情報

### ビルド方法
以下のコマンドをこのリポジトリで実行

```
npm install
npm run build
```

### ゲーム実行方法
以下のコマンドをこのリポジトリで実行

```
npm start
```

### ディレクトリ構造と主要ファイルの説明
* src
  * entities: g.E等を継承したエンティティを定義。描画とロジックの両方が必要なものをエンティティとして扱っている。
  * factory: ファクトリやcreate~関数等オブジェクトの生成を行うものをここに配置
  * scene: g.Sceneを継承したSceneクラスをここに配置
  * types: インターフェースやtypeを定義しているファイルを配置。各jsonファイルの型定義もここで行う
  * config.ts: 各所で参照する定数を定義
* text
  * characters.json: キャラクターのデータ一覧を持つファイル。キャラクターを追加する時はここに記載する。型は`types/Character.ts`に合わせる必要がある
  * items.json: アイテムのデータ一覧を持つファイル。アイテムを追加する時はここに記載する。型は`types/Item.ts`に合わせる必要がある
  * stages.json: ゲームステージのデータ一覧を持つファイル。ゲームステージを追加する時はここに記載する。型は`types/Stage.ts`に合わせる必要がある
  * weapons.json: 武器のデータ一覧を持つファイル。武器を追加する時はここに記載する。型は`types/Weapon.ts`に合わせる必要がある。
    * ただし武器機能は未実装なので、現在は空ファイルになっている

### ゲームの改造例
以下のドキュメントにこのゲームの改造例を記載しました。

* [素材の差し替え](./doc/change-asset.md)
* [データの書き換え](./doc/change-data.md)

## 利用素材
以下のサイトの素材を利用しています。ありがとうございます。
|サイト| バージョン| ライセンス| 用途|
|:----|:----|:----|:----|
|[Akashic Engine サンプルデモの素材](https://akashic-games.github.io/asset/material.html)| 2022-11-30 | CC BY 2.1 JP| アイテム画像・エフェクト　|
|[shinonomekazan/akashic-assets](https://github.com/shinonomekazan/akashic-assets)| 2022-11-30 | CC BY 2.1 JP| キャラクター画像・タイルマップ　|
|[泥棒バスター](https://github.com/akashic-contents/thiefBuster) | 2022-11-30 | CC BY 2.1 JP | ユーティリティ画像・フォント画像・SE |

## ライセンス
本リポジトリは MIT License の元で公開されています。
詳しくは [LICENSE](./LICENSE) をご覧ください。

ただし、画像ファイルおよび音声ファイルは
[CC BY 2.1 JP](https://creativecommons.org/licenses/by/2.1/jp/) の元で公開されています。
