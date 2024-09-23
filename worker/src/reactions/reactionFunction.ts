export type ReactionFunctionObject = {
    reactionObject: any,
    data: any
}

export type ReactionFunction = (arg: ReactionFunctionObject) => Promise<any> | undefined;
