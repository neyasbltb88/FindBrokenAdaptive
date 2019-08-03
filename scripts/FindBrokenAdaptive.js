class FindBrokenAdaptive {
    constructor(colors) {
        this.colors = colors;
        this.wrapperEl = null;
        this.lastTarget = null;
        this.init();
        this.start();
    }

    start() {

    }

    createWrapper() {
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

    init() {
        this.createWrapper();

        let target = document.querySelector('.board_body_item');
        target.appendChild(this.wrapperEl);
    }
}


window.findBrokenAdaptive = new FindBrokenAdaptive({
    main: '#f00',
    text: '#fff'
});