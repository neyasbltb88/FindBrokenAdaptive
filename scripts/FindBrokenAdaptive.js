class FindBrokenAdaptive {
    constructor(colors) {
        this.colors = colors;
        this.wrapperEl = null;
        this.nodeKeeper = null;
        this.lastTarget = null;
        this.hoverHandler = this._hoverHandler.bind(this);

        this.init();
        this.start();
    }

    _hoverHandler(event) {
        let el = event.target;
        if (this._findExceptions(el)) return;
        // console.log(el);

        this._restoreElems();

        this.lastTarget = el;
        el.before(this.wrapperEl);
        this.wrapperEl.appendChild(el);
        let elClasses = '.' + [...el.classList].join('.');
        this.wrapperEl.setAttribute('data-targetclass', elClasses);

    }

    _restoreElems() {
        if (this.lastTarget) {
            this.nodeKeeper.appendChild(this.lastTarget);
            this.wrapperEl.before(this.lastTarget);
            this.lastTarget = null;
            this.nodeKeeper.appendChild(this.wrapperEl);
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