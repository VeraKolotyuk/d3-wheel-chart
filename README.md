# d3-wheel-chart

Pie Chart where each section is split on given amount of levels. Each level can be clickable and has tooltip on hover.
Created for [wheel of life](https://www.indeed.com/career-advice/career-development/wheel-of-life) but can be used for any other data with the same format.

### Install

npm install d3-wheel-chart

### Usage

Required params _dimensions_ and _data_

```
    data = [
        {name: 'career', level: 4},
        {name: 'family', level: 7},
        {name: 'friends', level: 3},
        {name: 'health', level: 5}
    ]
```

```
    dimensions = {width: 200, height: 200, margins: {left: 0, right: 0, top: 10, bottom: 10}}
```

### Available properties
```
dimensions: IDimensions;
data: IWheel[];
levelHeight?: number;
levelsCount?: number;
theme?: ITheme;
onLevelClickHandler?: (name: string, level: number) => void;
tooltipHtmlRenderer?: (currentLevel: number, hoveredLevel: number, name: string) => string

```

```
Theme parameters

{
    strokeColor: string;
    selectedColor: string;
    defaultColor: string;
}

```
