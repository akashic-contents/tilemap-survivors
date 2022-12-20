import { TILE_HEIGHT, TILE_WIDTH } from "../config";
import { CharacterEntity } from "../entities/CharacterEntity";
import { FieldEntity } from "../entities/FieldEntity";
import { createItemEntity, PowerUpItemEntity, ScoreItemEntity, WeaponItemEntity } from "../entities/ItemEntity";
import { PlayableCharacterEntity } from "../entities/PlayableCharacterEntity";
import { ScoreEntity } from "../entities/ScoreEntity";
import { TimeEntity } from "../entities/TimeEntity";
import { characterDataTable, itemDataTable, stageDataTable } from "../global/dataTable";
import { createUiSprite } from "../global/sprite";
import { SpawnTiming, Stage } from "../types/Stage";

export interface GameFieldSceneParameterObject extends g.SceneParameterObject {
	stageId: string;
	playableCharacterId: string;
	timeLimit?: number;
	initialWeaponId?: string;
	onFinish?: (score: number) => void;
}

const DEFAULT_TIME_LIMIT = 60;

// ゲームシーン
export class GameFieldScene extends g.Scene {
	private _stage: Stage;
	private _fieldEntity!: FieldEntity;
	private _enemySpawner!: Spawner;
	private _itemSpawner!: Spawner;
	private _destinationOffset: g.CommonOffset | undefined;
	private _scoreEntity: ScoreEntity;
	private _timeEntity: TimeEntity;
	private _onFinish: ((score: number) => void) | undefined;

	constructor(param: GameFieldSceneParameterObject) {
		super(param);
		this._stage = stageDataTable.get(param.stageId);
		this._onFinish = param.onFinish ?? undefined;
		this.onLoad.add(() => {
			this._initialize(param);
		});
	}

	private _initialize(param: GameFieldSceneParameterObject): void {
		const character = characterDataTable.get(param.playableCharacterId);
		const playerEntity = new PlayableCharacterEntity({
			scene: this,
			src: this.asset.getImageById(character.assetId),
			width: TILE_WIDTH,
			height: TILE_HEIGHT,
			data: character,
			playerId: g.game.selfId,
			weaponIds: param.initialWeaponId ? [param.initialWeaponId] : []
		});
		this._fieldEntity = new FieldEntity({
			scene: this,
			src: this.asset.getImageById(this._stage.tileImageAssetId),
			tileWidth: TILE_WIDTH,
			tileHeight: TILE_HEIGHT,
			tileData: JSON.parse(this.asset.getTextById(this._stage.tileTextAssetId).data),
			redrawArea: { x: 0, y: 0, width: g.game.width, height: g.game.height },
			playerEntity
		});
		this.append(this._fieldEntity);
		this._scoreEntity = new ScoreEntity({
			scene: this,
			score: 0,
			x: 0.05 * g.game.width,
			width: 0.2 * g.game.width
		});
		this.append(this._scoreEntity);
		this._timeEntity = new TimeEntity({
			scene: this,
			timeLimit: param.timeLimit ?? DEFAULT_TIME_LIMIT,
			x: 0.85 * g.game.width,
			width: 0.15 * g.game.width
		});
		this.append(this._timeEntity);
		this._enemySpawner = new Spawner({
			events: this._stage.enemies,
			spawnFunc: (id: string, offset: g.CommonOffset) => {
				const enemy = characterDataTable.get(id);
				const entity = new CharacterEntity({
					scene: this,
					src: this.asset.getImageById(enemy.assetId),
					width: TILE_WIDTH,
					height: TILE_HEIGHT,
					data: enemy
				});
				this._fieldEntity.registerEnemy(entity, offset);
			}
		});
		this._itemSpawner = new Spawner({
			events: this._stage.items,
			spawnFunc: (id: string, offset: g.CommonOffset) => {
				const item = itemDataTable.get(id);
				const entity = createItemEntity({
					scene: this,
					src: this.asset.getImageById(item.assetId),
					width: TILE_WIDTH,
					height: TILE_HEIGHT,
					data: item
				});
				const func = (): void => {
					// TODO: 全ての種類のアイテムのふるまいを用意する
					switch (entity.type) {
						case "score":
							this._scoreEntity.changeScore((entity as ScoreItemEntity).score);
							break;
						case "powerup":
							this._fieldEntity.powerUpPlayerEntity(entity as PowerUpItemEntity);
							break;
						case "weapon":
							this._fieldEntity.addPlayerWeapon(entity as WeaponItemEntity);
							break;
						case "recovery":
							break;
						case "exp":
							break;
					}
				};
				this._fieldEntity.registerItem(entity, offset, func);
			}
		});
		this.onPointDownCapture.add((ev) => {
			this._destinationOffset = ev.point;
		});
		this.onPointMoveCapture.add((ev) => {
			if (this._destinationOffset) {
				this._destinationOffset.x += ev.prevDelta.x;
				this._destinationOffset.y += ev.prevDelta.y;
			}
		});
		this.onPointUpCapture.add((_ev) => {
			this._destinationOffset = undefined;
		});
		this.onUpdate.add(this._updateHandler, this);
	}

	private _updateHandler(): void {
		if (this._fieldEntity.isPlayerDied()) {
			this._scoreEntity.changeScore(-1 * Math.round(this._scoreEntity.score / 2));
			this._showResult(createUiSprite(this, "gameOver"));
		}
		if (this._timeEntity.isTimeout()) {
			this._showResult(createUiSprite(this, "timeUp"));
		}
		if (this._destinationOffset) {
			const diff = this._fieldEntity.movePlayerEntity(this._destinationOffset);
			this._destinationOffset.x += diff.x;
			this._destinationOffset.y += diff.y;
		}
		this._enemySpawner.handleUpdate();
		this._itemSpawner.handleUpdate();
	}

	private _showResult(entity: g.E): void {
		this.onUpdate.remove(this._updateHandler, this);
		this._announce(entity, 1000, () => {
			if (this._onFinish) {
				this._onFinish(this._scoreEntity.score);
			}
		});
	}

	private _announce(entity: g.E, time: number, func: () => void): void {
		const bgRect = new g.FilledRect({
			scene: this,
			cssColor: "black",
			width: g.game.width,
			height: g.game.height,
			opacity: 0.6
		});
		this.append(bgRect);
		entity.x = (g.game.width - entity.width) / 2;
		entity.y = (g.game.height - entity.height) / 2;
		this.append(entity);
		this.setTimeout(() => {
			bgRect.destroy();
			entity.destroy();
			func();
		}, time);
	}
}

interface SpawnerParameterObject {
	events: SpawnTiming[];
	spawnFunc: (id: string, offset: g.CommonOffset) => void;
}

// フィールド上での物体(敵やアイテムなど)の出現に関するクラス
class Spawner {
	readonly events: SpawnTiming[];
	readonly spawnFunc: (id: string, offset: g.CommonOffset) => void;
	protected currentIndex: number = 0;

	constructor(param: SpawnerParameterObject) {
		this.events = param.events;
		this.spawnFunc = param.spawnFunc;
	}

	handleUpdate(): void {
		if (this.currentIndex >= this.events.length) {
			return;
		}
		for (let i = this.currentIndex; i < this.events.length; i++) {
			const event = this.events[i];
			if (event.time !== g.game.age) {
				return;
			}
			for (let _j = 0; _j < event.count; _j++) {
				this.spawnFunc(event.id, event.relativeOffset);
			}
			this.currentIndex = i + 1;
		}
	}
}
