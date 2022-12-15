import { DEFAULT_ANIMATION_INTERVAL, GAME_HEIGHT, GAME_WIDTH } from "../config";
import { Character } from "../types/Character";
import { Direction } from "../types/Direction";
import { calculateSpeedInField } from "../util/calculate";
import { PowerUpItemEntity } from "./ItemEntity";

export interface CharacterEntityParameterObject extends g.FrameSpriteParameterObject {
	data: Character;
}

export const RIGHT_MOVING = [7, 8, 7, 6];
export const LEFT_MOVING = [4, 5, 4, 3];
export const UP_MOVING = [10, 11, 10, 9];
export const DOWN_MOVING = [1, 2, 1, 0];

export class CharacterEntity extends g.E {
	private _data: Character;
	private _currentHp: number;
	private _frameSprite: g.FrameSprite;
	private _direction: Direction = "RIGHT";

	constructor(param: CharacterEntityParameterObject) {
		super(param);
		this._data = param.data;
		this._currentHp = param.data.status.hp;
		this._frameSprite = new g.FrameSprite({
			scene: param.scene,
			src: param.src,
			width: param.width,
			height: param.height,
			x: param.x ?? GAME_WIDTH / 2,
			y: param.y ?? GAME_HEIGHT / 2,
			frames: param.frames ?? RIGHT_MOVING,
			interval: param.interval ?? DEFAULT_ANIMATION_INTERVAL,
			touchable: param.touchable ?? false
		});
		this._frameSprite.start();
		this.append(this._frameSprite);
	}

	get maxHP(): number {
		return this._data.status.hp;
	}

	get currentHP(): number {
		return this._currentHp;
	}

	get attack(): number {
		return this._data.status.attack;
	}

	get defence(): number {
		return this._data.status.defence;
	}

	get speed(): number {
		return this._data.status.speed;
	}

	get critical(): number {
		return this._data.status.critical;
	}

	get direction(): Direction {
		return this._direction;
	}

	get offset(): g.CommonOffset {
		return {
			x: this._frameSprite.x,
			y: this._frameSprite.y
		};
	}

	get area(): g.CommonArea {
		return {
			...this.offset,
			width: this._frameSprite.width,
			height: this._frameSprite.height
		};
	}

	get frameSprite(): g.FrameSprite {
		return this._frameSprite;
	}

	reduceHp(value: number): void {
		this._currentHp -= value;
		if (this._currentHp < 0) {
			this._currentHp = 0;
		}
	}

	recoverHp(value: number): void {
		this._currentHp += value;
		if (this._currentHp > this.maxHP) {
			this._currentHp = this.maxHP;
		}
	}

	isDied(): boolean {
		return this._currentHp <= 0;
	}

	// speed関係なく指定された分移動するだけのメソッド
	move(dx: number, dy: number): void {
		this._frameSprite.moveBy(dx, dy);
		if (dx > 0) {
			this._frameSprite.frames = RIGHT_MOVING;
			if (dy > 0) {
				this._direction = "RIGHT_DOWN";
			} else if (dy < 0) {
				this._direction = "RIGHT_UP";
			} else {
				this._direction = "RIGHT";
			}
		} else if (dx < 0) {
			this._frameSprite.frames = LEFT_MOVING;
			if (dy > 0) {
				this._direction = "LEFT_DOWN";
			} else if (dy < 0) {
				this._direction = "LEFT_UP";
			} else {
				this._direction = "LEFT";
			}
		} else {
			if (dy > 0) {
				this._direction = "DOWN";
				this._frameSprite.frames = DOWN_MOVING;
			} else {
				this._direction = "UP";
				this._frameSprite.frames = UP_MOVING;
			}
		}
		this._frameSprite.modified();
	}

	moveToTarget(target: g.CommonOffset, range: g.CommonArea): g.CommonOffset {
		const currentX: number = this._frameSprite.x + this._frameSprite.width / 2;
		const currentY: number = this._frameSprite.y + this._frameSprite.height / 2;
		const radian = Math.atan2(target.y - currentY, target.x - currentX);
		const speed = calculateSpeedInField(this.speed);
		const dx = Math.round(speed * Math.cos(radian));
		const dy = Math.round(speed * Math.sin(radian));
		if (
			range.x <= this._frameSprite.x + dx
			&& this._frameSprite.x + this._frameSprite.width + dx <= range.x + range.width
			&& range.y <= this._frameSprite.y + dy
			&& this._frameSprite.y + this._frameSprite.height + dy <= range.y + range.height
		) {
			this.move(dx, dy);
			return { x: dx, y: dy };
		} else {
			return { x: 0, y: 0 };
		}
	}

	putIn(offset: g.CommonOffset): void {
		this._frameSprite.moveTo(offset);
		this._frameSprite.modified();
	}

	powerUp(item: PowerUpItemEntity): void {
		this._data.status = {
			hp: this._data.status.hp,
			attack: this._data.status.attack + item.attack,
			defence: this._data.status.defence + item.defence,
			speed: this._data.status.speed + item.speed,
			critical: this._data.status.critical + item.critical
		};
	}
}
