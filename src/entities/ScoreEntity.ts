import { Label } from "@akashic-extension/akashic-label";
import { font28 } from "../global/font";
import { createUiSprite } from "../global/sprite";

interface ScoreEntityParameterObject extends g.EParameterObject {
	score: number;
}

export class ScoreEntity extends g.E {
	private _score: number;
	private _scoreLabel: Label;
	private _ptSprite: g.Sprite;

	constructor(param: ScoreEntityParameterObject) {
		super(param);
		const font = font28;
		this._score = param.score;
		this._scoreLabel = new Label({
			scene: param.scene,
			font: font,
			text: `${param.score}`,
			fontSize: 28,
			textAlign: "right",
			width: 0.9 * this.width
		});
		this.append(this._scoreLabel);
		this._ptSprite = createUiSprite(param.scene, "ptImage");
		this._ptSprite.x = this._scoreLabel.x + this._scoreLabel.width;
		this.append(this._ptSprite);
	}

	get score(): number {
		return this._score;
	}

	changeScore(value: number): void {
		this._score += value;
		this._scoreLabel.text = `${this._score}`;
		this._scoreLabel.invalidate();
	}
}
