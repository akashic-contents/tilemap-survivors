import { ExpItem, Item, ItemType, PowerUpItem, RecoveryItem, ScoreItem, WeaponItem } from "../types/Item";

export interface ItemEntityParmeterObject extends g.SpriteParameterObject {
	data: Item;
}

export interface RecoveryItemEntityParmeterObject extends ItemEntityParmeterObject {
	data: RecoveryItem;
}

export interface PowerUpItemEntityParmeterObject extends ItemEntityParmeterObject {
	data: PowerUpItem;
}

export interface ExpItemEntityParmeterObject extends ItemEntityParmeterObject {
	data: ExpItem;
}

export interface ScoreItemEntityParmeterObject extends ItemEntityParmeterObject {
	data: ScoreItem;
}

export interface WeaponItemEntityParmeterObject extends ItemEntityParmeterObject {
	data: WeaponItem;
}

export abstract class ItemEntity extends g.E {
	abstract type: ItemType;
	protected _data: Item;
	protected _sprite: g.Sprite;

	constructor(param: ItemEntityParmeterObject) {
		super(param);
		this._data = param.data;
		this._sprite = new g.Sprite({
			scene: param.scene,
			src: param.src,
			width: param.width,
			height: param.height
		});
		this.append(this._sprite);
	}

	get sprite(): g.Sprite {
		return this._sprite;
	}

	get name(): string {
		return this._data.name;
	}

	get describe(): string {
		return this._data.describe;
	}

	get area(): g.CommonArea {
		return this.sprite;
	}

	putIn(offset: g.CommonOffset): void {
		this._sprite.moveTo(offset);
		this._sprite.modified();
	}
}

export class RecoveryItemEntity extends ItemEntity {
	type: ItemType = "recovery";
	protected _data: RecoveryItem;

	constructor(param: RecoveryItemEntityParmeterObject) {
		super(param);
	}

	recover(hp: number): number {
		switch (this._data.recoveryType) {
			case "fixed":
				return this._data.recoveryValue;
			case "ratio":
				return this._data.recoveryValue * hp;
		}
	}
}

export class PowerUpItemEntity extends ItemEntity {
	type: ItemType = "powerup";
	protected _data: PowerUpItem;

	constructor(param: PowerUpItemEntityParmeterObject) {
		super(param);
	}

	get attack(): number {
		return this._data.attack;
	}

	get defence(): number {
		return this._data.defence;
	}

	get speed(): number {
		return this._data.speed;
	}

	get critical(): number {
		return this._data.critical;
	}
}

export class ExpItemEntity extends ItemEntity {
	type: ItemType = "exp";
	protected _data: ExpItem;

	constructor(param: ExpItemEntityParmeterObject) {
		super(param);
	}

	get exp(): number {
		return this._data.value;
	}
}

export class ScoreItemEntity extends ItemEntity {
	type: ItemType = "score";
	protected _data: ScoreItem;

	constructor(param: ScoreItemEntityParmeterObject) {
		super(param);
	}

	get score(): number {
		return this._data.score;
	}
}

export class WeaponItemEntity extends ItemEntity {
	type: ItemType = "weapon";
	protected _data: WeaponItem;

	constructor(param: WeaponItemEntityParmeterObject) {
		super(param);
	}

	get weaponId(): string {
		return this._data.weaponId;
	}
}

export function createItemEntity(param: ItemEntityParmeterObject): ItemEntity {
	switch (param.data.type) {
		case "exp":
			return new ExpItemEntity(param as ExpItemEntityParmeterObject);
		case "powerup":
			return new PowerUpItemEntity(param as PowerUpItemEntityParmeterObject);
		case "recovery":
			return new RecoveryItemEntity(param as RecoveryItemEntityParmeterObject);
		case "score":
			return new ScoreItemEntity(param as ScoreItemEntityParmeterObject);
		case "weapon":
			return new WeaponItemEntity(param as WeaponItemEntityParmeterObject);
	}
}
