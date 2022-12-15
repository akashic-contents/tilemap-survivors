import { weaponDataTable } from "../global/dataTable";
import { createWeaponEntity } from "../global/weapon";
import { calculateDamageValue } from "../util/calculate";
import { CharacterEntity, CharacterEntityParameterObject } from "./CharacterEntity";
import { WeaponEntity } from "./weapons/WeaponEntity";

interface PlayableCharacterEntityParameterObject extends CharacterEntityParameterObject {
	playerId: string;
	weaponIds: string[];
}

const DAMAGE_TIME = 500; // ダメージを受けている時間。この時間は無敵状態となる。
const DAMAGE_OPACITIES = [0.9, 0.75, 0.6, 0.45, 0.3]; // ダメージを受けている時の自キャラの透明度の遷移。
const HP_BAR_COLOR_SAFETY = "green"; // 通常時のHPバーの色
const HP_BAR_COLOR_DANGER = "red"; // 残りHPが少なった時のHPバーの色

export class PlayableCharacterEntity extends CharacterEntity {
	private _playerId: string;
	private _hpBar: g.FilledRect;
	private _damageValue: number | undefined = undefined;
	private _weaponEntities: WeaponEntity[];

	constructor(param: PlayableCharacterEntityParameterObject) {
		super(param);
		this._playerId = param.playerId;
		this._weaponEntities = param.weaponIds.map(id => {
			const entity = createWeaponEntity(param.scene, id);
			this.append(entity);
			return entity;
		});
		this._hpBar = new g.FilledRect({
			scene: param.scene,
			cssColor: HP_BAR_COLOR_SAFETY,
			width: param.width,
			height: 0.125 * param.height,
			x: this.frameSprite.x,
			y: this.frameSprite.y - 0.125 * param.height
		});
		this.append(this._hpBar);
		this.onUpdate.add(() => {
			this._weaponEntities.forEach(e => {
				e.offset = this.offset;
				e.direction = this.direction;
			});
			if (this.isDamaged) {
				const reduceRate = (this._damageValue / (g.game.fps * (DAMAGE_TIME / 1000))) / this.maxHP;
				this._damageAnimation(reduceRate);
			}
		});
	}

	get isDamaged(): boolean {
		return this._damageValue != null;
	}

	move(dx: number, dy: number): void {
		super.move(dx, dy);
		this._hpBar.moveBy(dx, dy);
		this._hpBar.modified();
	}

	damage(enemy: CharacterEntity): void {
		this._damageValue = calculateDamageValue(enemy, this);
		this.reduceHp(this._damageValue);
		this.scene.setTimeout(() => {
			this._damageValue = undefined;
			this.frameSprite.opacity = 1;
			this.frameSprite.modified();
		}, DAMAGE_TIME);
	}

	collectHitWeapons(area: g.CommonArea): WeaponEntity[] {
		return this._weaponEntities.filter(w => w.updateIsHit(area));
	}

	addWeapon(id: string): void {
		const weapon = weaponDataTable.get(id);
		const same = this._weaponEntities.find(w => w.kind === weapon.id);
		if (same) {
			same.lvUp();
		} else {
			const entity = createWeaponEntity(this.scene, id);
			this.append(entity);
			this._weaponEntities.push(entity);
		}
	}

	private _damageAnimation(reduceRate: number): void {
		this.frameSprite.opacity = DAMAGE_OPACITIES[g.game.age % DAMAGE_OPACITIES.length];
		this.frameSprite.modified();
		this._hpBar.width -= (reduceRate * this.frameSprite.width);
		if (this._hpBar.width < 0) {
			this._hpBar.width = 0;
		}
		if (this._hpBar.width < 0.3 * this.frameSprite.width) {
			this._hpBar.cssColor = HP_BAR_COLOR_DANGER;
		} else {
			this._hpBar.cssColor = HP_BAR_COLOR_SAFETY;
		}
		this._hpBar.modified();
	}
}
