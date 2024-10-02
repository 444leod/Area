import { ExampleActionDTO } from "./example-action.dto";
import { EachXSecondsDTO } from "./timer/each-x-seconds.dto";

export type AnyActionDTO =  ExampleActionDTO | EachXSecondsDTO;