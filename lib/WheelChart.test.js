"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WheelChart_1 = require("./WheelChart");
var react_1 = require("react");
var enzyme_adapter_react_17_1 = require("@wojtekmaj/enzyme-adapter-react-17");
var enzyme_1 = require("enzyme");
(0, enzyme_1.configure)({ adapter: new enzyme_adapter_react_17_1.default() });
describe('WheelChart tests', function () {
    it('renders correctly', function () {
        var data = [
            { name: 'career', level: 4 },
            { name: 'family', level: 7 },
            { name: 'friends', level: 3 },
            { name: 'health', level: 5 }
        ];
        var wrapper = (0, enzyme_1.shallow)(react_1.default.createElement(WheelChart_1.default, { data: data, dimensions: { width: 300, height: 300, margin: { left: 0, right: 0, top: 10, bottom: 10 } } }));
        expect(wrapper).toMatchSnapshot();
    });
});
//# sourceMappingURL=WheelChart.test.js.map