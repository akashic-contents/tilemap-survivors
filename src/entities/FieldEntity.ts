import { Tile, TileParameterObject } from "@akashic-extension/akashic-tile";
import { GAME_HEIGHT, GAME_WIDTH } from "../config";
import { calculateDamageValue } from "../util/calculate";
import { CharacterEntity } from "./CharacterEntity";
import { ItemEntity, PowerUpItemEntity, WeaponItemEntity } from "./ItemEntity";
import { PlayableCharacterEntity } from "./PlayableCharacterEntity";

interface FieldEntityParameterObject extends g.EParameterObject, TileParameterObject {
	playerEntity: PlayableCharacterEntity;
}

export class FieldEntity extends g.E {
	private _tile: Tile;
	private _viewOffset: g.CommonOffset;
	private _playerEntity: PlayableCharacterEntity;
	private _enemyEntites: CharacterEntity[] = [];
	private _itemEntities: ItemEntity[] = [];
	private _tileArea: g.CommonArea;

	constructor(param: FieldEntityParameterObject) {
		super(param);
		this._tile = new Tile({
			scene: param.scene,
			src: param.src,
			tileWidth: param.tileWidth,
			tileHeight: param.tileHeight,
			tileData: param.tileData,
			touchable: true
		});
		this._tileArea = {
			x: 0,
			y: 0,
			width: param.tileWidth * param.tileData[0].length,
			height: param.tileHeight * param.tileData.length
		};
		this._viewOffset = { x: 0, y: 0 };
		this._playerEntity = param.playerEntity;
		this.append(this._tile);
		this._tile.append(this._playerEntity);
	}

	registerEnemy(enemy: CharacterEntity, relativeOffset: g.CommonOffset): void {
		const offset = this._getSpawnOffset(relativeOffset, enemy.frameSprite.width, enemy.frameSprite.height, 100);
		enemy.putIn(offset);
		enemy.onUpdate.add(() => {
			const area = this._playerEntity.area;
			const x = area.x + 1.5 * g.game.random.generate() * area.width;
			const y = area.y + 1.5 * g.game.random.generate() * area.height;
			enemy.moveToTarget({ x, y }, this._tileArea);
			this._playerEntity.collectHitWeapons(enemy.area).forEach(w => {
				const damage = calculateDamageValue(this._playerEntity, enemy, w);
				enemy.reduceHp(damage);
			});
			if (g.Collision.intersectAreas(enemy.area, area) && !this._playerEntity.isDamaged) {
				this.scene.asset.getAudioById("se_damage").play();
				this._playerEntity.damage(enemy);
			}
			if (enemy.isDied()) {
				this._enemyEntites = this._enemyEntites.filter(e => e !== enemy);
				enemy.destroy();
			}
		});
		this._tile.append(enemy);
		this._enemyEntites.push(enemy);
	}

	registerItem(item: ItemEntity, relativeOffset: g.CommonOffset, func: () => void): void {
		const offset = this._getSpawnOffset(relativeOffset, item.sprite.width, item.sprite.height, 30);
		item.putIn(offset);
		item.onUpdate.add(() => {
			if (g.Collision.intersectAreas(item.area, this._playerEntity.area)) {
				this.scene.asset.getAudioById("se_item").play();
				func();
				this._itemEntities = this._itemEntities.filter(i => i !== item);
				item.destroy();
			}
		});
		this._tile.append(item);
		this._itemEntities.push(item);
	}

	movePlayerEntity(targetOffset: g.CommonOffset): g.CommonOffset {
		const prev = this._playerEntity.moveToTarget(targetOffset, this._tileArea);
		return this._moveViewOffset(prev.x, prev.y);
	}

	powerUpPlayerEntity(item: PowerUpItemEntity): void {
		this._playerEntity.powerUp(item);
	}

	addPlayerWeapon(item: WeaponItemEntity): void {
		this._playerEntity.addWeapon(item.weaponId);
	}

	isPlayerDied(): boolean {
		return this._playerEntity.isDied();
	}

	private _getSpawnOffset(relativeOffset: g.CommonOffset, width: number, height: number, randomRange: number): g.CommonOffset {
		let x = this._playerEntity.offset.x + relativeOffset.x + 2 * randomRange * g.game.random.generate() - randomRange;
		if (x < this._tileArea.x) {
			x = this._tileArea.x;
		} else if (x > this._tileArea.x + this._tileArea.width - width) {
			x = this._tileArea.x + this._tileArea.width - width;
		}
		let y = this._playerEntity.offset.y + relativeOffset.y + 2 * randomRange * g.game.random.generate() - randomRange;
		if (y < this._tileArea.y) {
			y = this._tileArea.y;
		} else if (y > this._tileArea.y + this._tileArea.height - height) {
			y = this._tileArea.y + this._tileArea.height - height;
		}
		return { x, y };
	}

	private _moveViewOffset(dx: number, dy: number): g.CommonOffset {
		const diff = { x: 0, y: 0 };
		const afterX = this._viewOffset.x + dx;
		const afterY = this._viewOffset.y + dy;
		const xThreshold = 0.4 * GAME_WIDTH;
		const yThreshold = 0.4 * GAME_HEIGHT;
		if (
			0 <= afterX
			&& afterX + g.game.width <= this._tile.width
			&& xThreshold <= this._playerEntity.offset.x
			&& this._playerEntity.offset.x <= this._tileArea.width - xThreshold
		) {
			this._tile.x -= dx;
			this._viewOffset.x = afterX;
			diff.x = dx;
		}
		if (
			0 <= afterY
			&& afterY + g.game.height <= this._tile.height
			&& yThreshold <= this._playerEntity.offset.y
			&& this._playerEntity.offset.y <= this._tileArea.height - yThreshold
		) {
			this._tile.y -= dy;
			this._viewOffset.y = afterY;
			diff.y = dy;
		}
		this._tile.invalidate();
		return diff;
	}
}
