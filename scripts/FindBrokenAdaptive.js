const borrowStyles = [
    'display',
    'position',
    'top',
    'right',
    'bottom',
    'left',
    'width',
    'maxWidth',
    'minWidth',
    'height',
    'maxHeight',
    'minHeight',
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',
    'flexBasis',
    'flexGrow',
    'flexShrink',
    'justifySelf',
    'alignSelf',
    'order',
    'boxSizing',
    'lineHeight',
    'verticalAlign',
    'float',
    'alignmentBaseline',
    'visibility',
    'zIndex',
    // 'blockSize',
];

const replaceTargetStyles = {
    'position': 'static',
    'marginTop': 0,
    'marginRight': 0,
    'marginBottom': 0,
    'marginLeft': 0,
    'margin': 0,
    'top': 0,
    'right': 0,
    'bottom': 0,
    'left': 0,
    'width': 'auto',
    'height': 'auto',
    'flexBasis': '100%',
    'flexGrow': 1,
};

class FindBrokenAdaptive {
    constructor(colors) {
        this.colors = colors;
        this.wrapperEl = null;
        this.nodeKeeper = null;
        this.lastTarget = null;
        this.lastTargetStyles = null;
        this.hoverHandler = this._hoverHandler.bind(this);
        this.borrowStyles = borrowStyles;
        this.replaceTargetStyles = replaceTargetStyles;

        this.init();
        this.start();
    }

    _camelToKebab(string) {
        return string.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    }

    _hoverHandler(event) {
        let el = event.target;
        if (this._findExceptions(el)) return;
        // console.log(el);

        this._restoreElems();

        this.lastTarget = el;
        el.before(this.wrapperEl);
        this._borrowingStyle();
        this.wrapperEl.appendChild(el);
        let elClasses = '.' + [...el.classList].join('.');
        this.wrapperEl.setAttribute('data-targetclass', elClasses);

    }

    _restoreElems() {
        if (this.lastTarget) {
            this.nodeKeeper.appendChild(this.lastTarget);
            this.lastTarget.style.cssText = this.lastTargetStyles;
            this.lastTargetStyles = null;
            this.wrapperEl.before(this.lastTarget);
            this.lastTarget = null;
            this.wrapperEl.removeAttribute('style');
            this.nodeKeeper.appendChild(this.wrapperEl);
        }
    }

    _borrowingStyle() {
        let buildStyle = '';
        let computedStyle = {
            ...getComputedStyle(this.lastTarget)
        };

        // let {
        //     width,
        //     height
        // } = this.lastTarget.getBoundingClientRect();

        // console.log(`width: ${width}; height: ${height}`);

        let width = parseFloat(computedStyle.width) +
            parseFloat(computedStyle.paddingLeft) +
            parseFloat(computedStyle.paddingRight) +
            parseFloat(computedStyle.borderLeftWidth) +
            parseFloat(computedStyle.borderRightWidth) +
            'px'

        let height = parseFloat(computedStyle.height) +
            parseFloat(computedStyle.paddingTop) +
            parseFloat(computedStyle.paddingBottom) +
            parseFloat(computedStyle.borderTopWidth) +
            parseFloat(computedStyle.borderBottomWidth) +
            'px'

        computedStyle.width = width;
        computedStyle.height = height;

        this.borrowStyles.forEach(style => {
            buildStyle += `${this._camelToKebab(style)}: ${computedStyle[style]}; `;
        });

        this.wrapperEl.setAttribute('style', buildStyle);

        this.lastTargetStyles = this.lastTarget.style.cssText;
        for (let style in this.replaceTargetStyles) {
            this.lastTarget.style[style] = this.replaceTargetStyles[style];
        }
    }

    start() {
        document.addEventListener('mouseover', this.hoverHandler);
    }

    stop() {
        this._restoreElems();
        document.removeEventListener('mouseover', this.hoverHandler);
    }

    _findExceptions(el) {
        let result = false;

        if (el === this.wrapperEl) result = true;
        if (el === this.lastTarget) result = true;
        if (el.nodeName.toLowerCase() === 'html') result = true;
        if (el.nodeName.toLowerCase() === 'head') result = true;
        if (el.nodeName.toLowerCase() === 'body') result = true;

        return result;
    }

    createWrapper() {
        if (this.wrapperEl) return;

        this.wrapperEl = document.createElement('span');
        this.wrapperEl.className = 'FindBrokenAdaptive_wrapper';
        this.wrapperEl.setAttribute('data-targetclass', '.какой-то класс');
        let wrapperStyle = document.createElement('style');
        wrapperStyle.textContent = /* css */ `
            .FindBrokenAdaptive_wrapper {
                outline: 1px solid ${this.colors.main} !important;
            }

            .FindBrokenAdaptive_wrapper:before {
                content: attr(data-targetclass);
                background-color: ${this.colors.main};
                color: ${this.colors.text};
                position: absolute;
                padding: 2px;
                font-size: 12px;
            }
        `;

        this.wrapperEl.appendChild(wrapperStyle);
    }

    createNodeKeeper() {
        if (document.querySelector('.FindBrokenAdaptive_nodeKeeper')) return;

        this.nodeKeeper = document.createElement('div');
        this.nodeKeeper.className = 'FindBrokenAdaptive_nodeKeeper';
        this.nodeKeeper.style.display = 'none';
        document.body.appendChild(this.nodeKeeper);
    }

    init() {
        this.createNodeKeeper();
        this.createWrapper();
    }
}


window.findBrokenAdaptive = new FindBrokenAdaptive({
    main: '#f00',
    text: '#fff'
});