import { Label } from "@akashic-extension/akashic-label";
import { font72 } from "../global/font";
import { createUiSprite } from "../global/sprite";

interface ScoreBoardEntityParameterObject extends g.EParameterObject {
	score: number;
}

export class ScoreBoardEntity extends g.E {
	private _boardSprite: g.Sprite;
	private _scoreLabel: Label;

	constructor(param: ScoreBoardEntityParameterObject) {
		super(param);
		this._boardSprite = createUiSprite(param.scene, "scoreFrame");
		this.x = (g.game.width - this._boardSprite.width) / 2;
		this.y = (g.game.height - this._boardSprite.height) / 2;
		const font = font72;
		this._scoreLabel = new Label({
			scene: param.scene,
			font: font,
			text: `${param.score}`,
			fontSize: 72,
			textAlign: "right",
			width: 0.7 * this._boardSprite.width,
			x: 0.1 * this._boardSprite.width,
			y: 0.5 * this._boardSprite.height
		});
		this._boardSprite.append(this._scoreLabel);
		this.append(this._boardSprite);
	}
}
