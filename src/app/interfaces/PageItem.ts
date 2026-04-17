export interface PageItem {
    type: 'number' | 'ellipsis';
    value?: number;
    hiddenPages?: number[];
    isEnd?: boolean;
}