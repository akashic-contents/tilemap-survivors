import { GAME_HEIGHT, GAME_WIDTH } from "../../config";
import { Direction, DIRECTIONS } from "../../types/Direction";
import { calculateOffset } from "../../util/calculate";
import { WeaponEntity, WeaponEntityParameterObject } from "./WeaponEntity";

const ATTACKS = [1, 1.3, 1.3, 1.75, 1.75, 2.5, 2.5];
const RIGIDITIES = [1500, 1500, 1000, 1000, 750, 750, 500];
const SHOT_COUNTS = [1, 1, 2, 2, 3, 3, 4];
const SHOT_RANGES = [1, 1, 1, 2, 2, 3, 5];
const SHOT_SPEED = 80;

interface Shot {
	sprite: g.Sprite;
	direction: Direction;
	isHit: boolean;
}

// shotが移動可能な領域
// TODO: 本来はFieldEntityからCommonAreaを取得すべきだが、その場合各エンティティのデータ構造を見直す必要があるので一旦決め打ちの値を設定する
const SHOT_MOVABLE_AREA: g.CommonArea = { x: 0, y: 0, width: 5 * GAME_WIDTH, height: 5 * GAME_HEIGHT };

export class ShotWeaponEntity extends WeaponEntity {
	readonly kind: string = "shot";
	private _shots: Shot[] = [];
	private _shotCount: number;
	private _shotRange: number;
	private _shotAsset: g.ImageAsset;
	private _currentWaitingTime: number = 0;

	constructor(param: WeaponEntityParameterObject) {
		super(param);
		this._shotAsset = this.scene.asset.getImageById("shot");
		this._setPropaties();
		this.onUpdate.add(this._animation, this);
	}

	updateIsHit(area: g.CommonArea): boolean {
		const hitShots = this._shots.filter(s => {
			if (g.Collision.intersectAreas(s.sprite, area)) {
				s.isHit = true;
				return true;
			}
			return false;
		});
		return hitShots.length > 0;
	}

	protected _handleLevelUp(): void {
		this._setPropaties();
	}

	protected _animation(): void {
		// shot削除
		const existHitShots = this._shots.filter(s => {
			if (s.isHit || !g.Collision.intersectAreas(s.sprite, SHOT_MOVABLE_AREA)) {
				s.sprite.destroy();
				return false;
			}
			return true;
		});
		this._shots = existHitShots;

		// shot移動
		this._shots.forEach(s => {
			const offset = calculateOffset(SHOT_SPEED, s.direction);
			s.sprite.moveBy(offset.x, offset.y);
		});

		// shot生成
		this._currentWaitingTime += 1000 / g.game.fps;
		if (this._currentWaitingTime < this.cooldown) {
			return;
		}
		this._currentWaitingTime = 0;
		const startRangeIndex = -1 * Math.floor(this._shotRange / 2);
		const endRangeIndex = Math.ceil(this._shotRange / 2);
		for (let i = startRangeIndex; i < endRangeIndex; i++) {
			const direction = DIRECTIONS[(DIRECTIONS.indexOf(this.direction) + i) % DIRECTIONS.length];
			for (let j = 0; j < this._shotCount; j++) {
				const offset = calculateOffset(1.2 * j * this._shotAsset.width, direction);
				const sprite = new g.Sprite({
					scene: this.scene,
					src: this._shotAsset,
					x: this.offset.x + offset.x,
					y: this.offset.y + offset.y
				});
				this.append(sprite);
				this._shots.push({ sprite, direction, isHit: false });
			}
		}
	}

	private _setPropaties(): void {
		this._attack = ATTACKS[this.lv - 1];
		this._cooldown = RIGIDITIES[this.lv - 1];
		this._shotCount = SHOT_COUNTS[this.lv - 1];
		this._shotRange = SHOT_RANGES[this.lv - 1];
	}
}
