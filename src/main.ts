import { TIME_NOT_FOR_GAME } from "./config";
import { GameMainParameterObject } from "./parameterObject";
import { GameFieldScene } from "./scene/GameFieldScene";
import { GameResultScene } from "./scene/GameResultScene";

export function main(param: GameMainParameterObject): void {
	const timeLimit = param.sessionParameter.totalTimeLimit;
	const scene = new GameFieldScene({
		game: g.game,
		assetPaths: ["/**/*"],
		stageId: "stage001",
		playableCharacterId: "dog",
		timeLimit: timeLimit ? timeLimit - TIME_NOT_FOR_GAME : undefined,
		initialWeaponId: "shot",
		onFinish: (score: number) => {
			const resultScene = new GameResultScene({
				game: g.game,
				assetPaths: ["/**/*"],
				score
			});
			g.game.pushScene(resultScene);
		}
	});
	g.game.pushScene(scene);
}
