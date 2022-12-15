import { ShotWeaponEntity } from "../entities/weapons/ShotWeaponEntity";
import { WeaponEntity } from "../entities/weapons/WeaponEntity";
import { weaponDataTable } from "./dataTable";

export function createWeaponEntity(scene: g.Scene, id: string): WeaponEntity {
	const data = weaponDataTable.get(id);
	switch (data.id) {
		case "shot":
			return new ShotWeaponEntity({ scene, data });
		default:
			throw new Error(`${data.id} is not found.`);
	}
}
