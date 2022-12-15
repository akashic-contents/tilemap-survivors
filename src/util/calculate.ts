import { STANDARD_SPEED } from "../config";
import { CharacterEntity } from "../entities/CharacterEntity";
import { WeaponEntity } from "../entities/weapons/WeaponEntity";
import { Direction, getAngle } from "../types/Direction";

export function calculateOffset(speed: number, direction: Direction): g.CommonOffset {
	const speedInField = calculateSpeedInField(speed);
	const angle = getAngle(direction);
	const x = speedInField * Math.cos(angle / 180 * Math.PI);
	const y = speedInField * Math.sin(angle / 180 * Math.PI);
	return { x, y };
}

export function calculateSpeedInField(speed: number): number {
	return Math.pow(speed / STANDARD_SPEED, 0.75);
}

export function calculateDamageValue(attacker: CharacterEntity, defencer: CharacterEntity, weapon?: WeaponEntity): number {
	const attack = weapon != null ? attacker.attack * weapon.attack : attacker.attack;
	const value = Math.round(Math.pow(attack, 2) / (attack + defencer.defence));
	if (g.game.random.generate() <= attacker.critical) {
		return 1.5 * value;
	} else {
		return value;
	}
}
