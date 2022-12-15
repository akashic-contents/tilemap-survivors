// キャラクター情報
export interface Character {
	assetId: string; // フィールド上に表示される画像アセットID。32*32のドット絵が横3枚*縦4枚で並んでいる想定。
	name: string; // キャラクター名。ただし現状のロジックではどこにも表示されていない。
	status: CharacterStatus; // キャラクターの能力情報。
}

// キャラクターの能力情報
export interface CharacterStatus {
	hp: number; // HP。0になったら消滅、自キャラであればゲームオーバーとなる。
	attack: number; // 攻撃力。高いほど敵に与えるダメージ量も大きくなる。
	defence: number; // 防御力。高いほど敵から受けるダメージ量も小さくなる。
	speed: number; // 素早さ。高いほどフィールド上での移動速度が早くなる。
	critical: number; // クリティカル率。値域は0.0~1.0。高いほど攻撃時にクリティカル(1.5倍攻撃)になりやすい。
}
