import { Direction } from "../../types/Direction";
import { Weapon } from "../../types/Weapon";

export interface WeaponEntityParameterObject extends g.EParameterObject {
	data: Weapon;
}

export const WEAPON_MIN_LEVEL = 1;
export const WEAPON_MAX_LEVEL = 7;

export abstract class WeaponEntity extends g.E {
	abstract readonly kind: string;
	protected _lv: number = WEAPON_MIN_LEVEL;
	protected _attack: number = 0;
	protected _cooldown: number = 0;
	private _offset: g.CommonOffset = { x: 0, y: 0 };
	private _direction: Direction = "RIGHT";

	constructor(param: WeaponEntityParameterObject) {
		super(param);
	}

	get offset(): g.CommonOffset {
		return this._offset;
	}

	set offset(o: g.CommonOffset) {
		this._offset = o;
	}

	get direction(): Direction {
		return this._direction;
	}

	set direction(d: Direction) {
		this._direction = d;
	}

	get lv(): number {
		return this._lv;
	}

	get attack(): number {
		return this._attack;
	}

	get cooldown(): number {
		return this._cooldown;
	}

	lvUp(): void {
		this._lv++;
		if (this._lv > WEAPON_MAX_LEVEL) {
			this._lv = WEAPON_MAX_LEVEL;
		}
		this._handleLevelUp();
	}

	abstract updateIsHit(area: g.CommonArea): boolean;

	protected abstract _handleLevelUp(): void;

	protected abstract _animation(): void;
}
