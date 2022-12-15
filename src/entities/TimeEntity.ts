import { Label } from "@akashic-extension/akashic-label";
import { font28 } from "../global/font";
import { createUiSprite } from "../global/sprite";

interface TimeEntityPrameterObject extends g.EParameterObject {
	timeLimit: number;
}

export class TimeEntity extends g.E {
	private _time: number;
	private _timeIconSprite: g.Sprite;
	private _timeLabel: Label;

	constructor(param: TimeEntityPrameterObject) {
		super(param);
		this._time = param.timeLimit;
		this._timeIconSprite = createUiSprite(param.scene, "clockIcon");
		const font = font28;
		this._timeLabel = new Label({
			scene: param.scene,
			font: font,
			text: `${Math.ceil(param.timeLimit)}`,
			fontSize: 28,
			width: this.width - this._timeIconSprite.width,
			x: this._timeIconSprite.width,
			y: 0.075 * this._timeIconSprite.height,
		});
		this.onUpdate.add(() => {
			this._time -= 1 / g.game.fps;
			this._timeLabel.text = `${Math.ceil(this._time)}`;
			this._timeLabel.invalidate();
		});
		this.append(this._timeIconSprite);
		this.append(this._timeLabel);
	}

	isTimeout(): boolean {
		return this._time <= 0;
	}
}
