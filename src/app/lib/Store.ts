export default class Store {
  private data;
  private history = {
    undo: [],
    redo: []
  };

  constructor(initialState = {}) {
    this.data = {...initialState, action: EActions.START};
  }

  dispatch(action: EActions, payload: any = {}): any {
    const {isMouseDown} = payload;
    const rect = {...this.data.rect, ...payload.rect};
    switch (action) {

      case EActions.DRAW_RECT:
        this.data = {...this.data, action, rect, isMouseDown, toDraw: false};
        break;
      case EActions.FINISH_DRAW_RECT:
        this.data = {...this.data, action, rect, isMouseDown, toDraw: true};
        break;
      case EActions.DRAW_IMG:
        this.data = {...this.data, action, toDraw: true, ...payload};
        break;
      default:
        this.data = {...this.data, action, rect, ...payload, toDraw: false};
    }
    if (this.data.toDraw) {
      this.history.undo.push(this.data);
      this.history.redo = [];
    }
  }

  get state() {
    return this.data;
  }

  get undoHistory() {
    return this.history.undo.filter(s => s.toDraw);
  }

  get redoHistory() {
    return this.history.redo.filter(s => s.toDraw);
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

export enum EActions {
  DRAW_IMG = 'DRAW_IMG',
  DRAW_RECT = 'DRAW_RECT',
  FINISH_DRAW_RECT = 'FINISH_DRAW_RECT',
  START = 'START'
}
