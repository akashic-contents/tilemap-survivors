import { ScoreBoardEntity } from "../entities/ScoreBoardEntity";

export interface GameResultSceneParameterObject extends g.SceneParameterObject {
	score: number;
}

// ゲーム結果を表示するシーン
export class GameResultScene extends g.Scene {
	private _scoreBoardEntity: ScoreBoardEntity;
	constructor(param: GameResultSceneParameterObject) {
		super(param);
		this.onLoad.add(() => {
			this._initialize(param);
		});
	}

	private _initialize(param: GameResultSceneParameterObject): void {
		this._scoreBoardEntity = new ScoreBoardEntity({
			scene: this,
			score: param.score
		});
		this.append(this._scoreBoardEntity);
	}
}
