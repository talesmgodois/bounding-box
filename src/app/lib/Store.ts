export default class Store {
    private data;
    public history = {
        undo:[],
        redo:[]
    };

    constructor(initialState = {}) {
        this.data  = {...initialState, action:EActions.START};
    }

    dispatch(action:EActions, payload:any = {}): any {
        this.history.undo.push(this.data);

        switch(action){
            case EActions.DRAW_RECT:
            case EActions.FINISH_DRAW_RECT:
                const {isMouseDown} = payload;
                const rect = {...this.data.rect, ...payload.rect};
                this.data ={...this.data,action,rect, isMouseDown};
                break;
            default:
                this.data ={...this.data,action, rect, ...payload};
        }
    }

    get state() {
        return this.data;
    }

    undo() {
        const lastState = this.history.undo.pop();
        this.history.redo.unshift(lastState);
    }

    redo() {
        const lastState = this.history.redo.shift();
        this.history.undo.push(lastState);
    }

}

interface RectState {
    mouseX?:number;
    mouseY?:number;
    canvasX?:number;
    canvasY?:number;
    evX?: number;
    evY?: number;
    currentImg?:string;
    isMouseDown?: boolean;
    isDrawing?: boolean;
    readyToDraw?: boolean;
}

interface ImgState {
    readyToDraw?: boolean;
    currentImg?: string;
}

interface IStore {
    state: any;
    history: Array<any>;
}

export enum EActions {
    DRAW_IMG = 'DRAW_IMG',
    DRAW_RECT = 'DRAW_RECT',
    DRAWING_RECT = 'DRAWING_RECT',
    FINISH_DRAW_RECT = 'FINISH_DRAW_RECT',
    CLEAR_RECT = 'CLEAR_RECT',
    CLEAR_IMG = 'CLEAR_IMG',
    CLEAR_ALL = 'CLEAR_ALL',
    START = 'START'
}


