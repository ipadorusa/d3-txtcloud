import { Init, d3Remove, d3, svgCheck, log} from '@saramin/ui-d3-helper';
import CLASS from '@saramin/ui-d3-selector';
import * as cloud from 'd3-cloud';

const TxtCloud = function(...arg) {

    const plugin = new Init(arg);
    let _this = {},
        targetNodes = _this.targetNodes = Init.setTarget(plugin),
        dataContainer = _this.dataContainer = Init.setData(plugin),
        options = _this.options = Init.setOptions(plugin, {
            w: 134,
            h: 134,
            wrapClass: `${CLASS.txtCloudClass}`
        }),
        instances = _this.instances = [];

    Array.from(targetNodes).forEach(exec);


    function exec(el, i) {
        if(svgCheck.status) {
            let data = dataContainer[i];
            let countMin = d3.min(data[0], d => d.value);
            let countMax = d3.max(data[0], d => d.value);
            let sizeScale = d3.scaleLinear().domain([countMin, countMax]).range([20, 45]);
            let keywords = [];

            data[0].forEach(d => d.character === 'y' ? keywords.push(d.item) : false);

            let words = data[0].map(d => {
                return {
                    text: d.item,
                    size: sizeScale(d.value)
                };
            });
            cloud().size([options.w, options.h])
                .words(words)
                .rotate( _ => (~~(Math.random() * 6) - 4) * 10)
                .font('MalgunGothic')
                .fontSize(function(d) { return d.size })
                .on("end", draw)
                .start();

            function draw(words) {
                d3.select(el)
                    .append('svg')
                    .classed(`${options.wrapClass}`, true)
                    .attr('width', options.w)
                    .attr('height', options.h)
                    .attr('viewBox', `0 0 ${options.w} ${options.h}`)
                    .append('g')
                    .attr('transform', 'translate(' + options.w / 2 + ',' + options.h / 2 + ')')
                    .selectAll("text")
                    .data(words)
                    .enter()
                    .append("text")
                    .style("font-size", d => d.size + "px")
                    .style("font-weight", d => (keywords.length > 0 && keywords.indexOf(d.text) > -1 ? "bold" : "normal"))
                    .style("fill", d => (keywords.length > 0 && keywords.indexOf(d.text) > -1 ? "#2365f2" : "#394164"))
                    .attr("text-anchor", "middle")
                    .attr("transform", function (d) {
                        return "translate(" + [d.x, d.y] + ") rotate(" + d.rotate + ")";
                    })
                    .text(function (d) {
                        return d.text;
                    });
            }

        } else {
            el.innerHTML = '<p class="svg_not_supported">SVG를 지원하지 않는 브라우저입니다.</p>'
        }

    }
    return _this;
};


export default TxtCloud;
