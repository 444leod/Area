import { ActionTypes } from "../action-types.enum";
import {BaseActionInfos} from "../action-infos.class";
import {IsNotEmpty, IsNumber, Min} from "class-validator";

export class EachXSecondsActionInfos extends BaseActionInfos {
    type: ActionTypes.EACH_X_SECONDS;

    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    seconds: number;
}