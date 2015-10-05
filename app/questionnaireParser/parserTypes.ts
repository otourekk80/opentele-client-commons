export interface NodeModel {
    heading?: string;
    info?: string;
    eventListener?: Function;
    measurementSelections?: any;
}

export interface Representation {
    nodeModel: NodeModel;
    nodeTemplate?: any;
    leftButton?: any;
    centerButton?: any;
    rightButton?: any;
}

export interface LeftButton {
    text: string;
    nextNodeId: string;
}

export interface RightButton {
    text: string;
    nextNodeId: string;
    validate?: Function;
    clickAction?: Function;
}

export interface Html5Hook {
    elementId: string;
    modelName: string;
    callbackName: string;
}
