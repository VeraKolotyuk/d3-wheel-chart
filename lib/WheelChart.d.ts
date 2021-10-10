/// <reference types="react" />
import './styles.css';
interface IWheel {
    name: string;
    level: number;
}
interface ITheme {
    strokeColor: string;
    selectedColor: string;
    defaultColor: string;
}
interface IMargin {
    left: number;
    right: number;
    top: number;
    bottom: number;
}
export interface IDimensions {
    width: number;
    height: number;
    margin: IMargin;
}
declare type Props = {
    dimensions: IDimensions;
    data: IWheel[];
    levelHeight?: number;
    levelsCount?: number;
    theme?: ITheme;
    onLevelClickHandler?: (a: string, b: number) => void;
    tooltipHtmlRenderer?: (a: number, b: number, c: string) => string;
};
declare const WheelChart: ({ data, onLevelClickHandler, tooltipHtmlRenderer, dimensions, theme, levelHeight, levelsCount }: Props) => JSX.Element;
export default WheelChart;
