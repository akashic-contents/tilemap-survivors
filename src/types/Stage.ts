// フィールドに関する情報
export interface Stage {
	tileImageAssetId: string; // フィールドのマップチップ画像のアセットID。
	tileTextAssetId: string; // フィールドのマップ情報を記載したテキストのアセットID。
	enemies: SpawnTiming[]; // フィールド上での敵の出現情報一覧。timeの値が若い順にデータを定義する必要がある。
	items: SpawnTiming[]; // フィールド上でのアイテムの出現情報一覧。timeの値が若い順にデータを定義する必要がある。
}

// 敵やアイテムのフィールド上への出現情報
export interface SpawnTiming {
	id: string; // jsonファイルに記載されているID(キー)。
	time: number; // 出現する時間。単位はフレーム数であることに注意。
	relativeOffset: g.CommonOffset; // 自キャラの座標を(0, 0)とした時の出現座標。
	count: number; // 出現数。
}
