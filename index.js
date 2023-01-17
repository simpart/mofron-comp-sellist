/**
 * @file mofron-comp-sellist/index.js
 * @brief selectable list component for mofron
 * @license MIT
 */
const Text    = require('mofron-comp-text');
const Table   = require('mofron-comp-table');
const Check   = require('mofron-comp-labelautycheck');
const Link    = require('mofron-event-link');
const Color   = require('mofron-effect-color');
const ConfArg = mofron.class.ConfArg;
const comutl  = mofron.util.common;

module.exports = class extends Table {
    /**
     * initialize component
     * 
     * @param (mixed) 
     *                key-value: component config
     * @short 
     * @type private
     */
    constructor (p1) {
        try {
            super();
            this.modname('sellist');
            
	    /* init config */
            this.confmng().add('row-index',   { type: 'number', init: 0 });
            this.confmng().add("accentColor", { type: "color", init: [120,133,205]})
            
	    if (0 < arguments.length) {
                this.config(p1);
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }

    initDomConts () {
        try {
            super.initDomConts();
            this.config({
                "rules":     "rows",
	        "rowHeight": "0.8rem",
            });
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    head (prm, cnf) {
        try {
	    if (undefined === prm) {
                return super.head();
	    }
	    /* setter */
	    let chkbx_chg = (c1,c2,c3) => {
                try {
		    c3.data('is_head_checked', true);
                    let row_len = c3.confmng('contents').length;
		    for (let ridx=0;ridx < row_len;ridx++) {
                        c3.select(c2,ridx);
		    }
		    c3.data('is_head_checked', false);
		} catch (e) {
                    console.error(e.stack);
                    throw e;
		}
	    }
	    let add_head = [
                new Check({
                    style: { 'width': '0.16rem', 'margin': 'auto' },
                    changeEvent: new ConfArg(chkbx_chg,this),
                })
            ];
            for (let pidx in prm) {
                let add = new Text({ text: prm[pidx], size: '0.2rem' });
                add.config(cnf)
                add_head.push(add);
	    }
	    super.head(add_head);
	} catch (e) {
            console.error(e.stack);
            throw e;
	}
    }

    select (flg,idx) {
        try {
	    if (undefined === flg) {
                let ret   = [];
                let conts = this.confmng('contents');
                for (let cidx in conts) {
                    ret.push(conts[cidx][0].checked());
                }
                return ret;
	    }
	    /* switching row color */
            let tr_dom = this.confmng('contents')[idx][0].rootDom()[0].parent().parent();
            let speed  = (true === flg) ? '300' : '200';
            //let bg_clr = (true === flg) ? this.accentColor() : this.baseColor();
	    
            tr_dom.style({
                'transition': 'background '+ speed +'ms 120ms ease',
                'background': (true === flg) ? this.accentColor() : this.baseColor()
            });

            /* invert text color */
	    let conts = this.confmng('contents')[idx];
	    for (let cidx=1;cidx < conts.length;cidx++) {
                conts[cidx].execEffect((true === flg) ? 2 : 3);
	    }
	    /* change checkbox */
	    this.confmng('contents')[idx][0].checked(flg);
	} catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    insert (prm) {
        try {
            let chkbx_chg = (p1,p2,p3) => {
                let conts = p3.confmng('contents');
                let row_idx = 0;
                for (let cidx in conts) {
                    if (p1.id() === conts[cidx][0].id()) {
                        row_idx = parseInt(cidx);
                    }
                }
		if (true !== p3.data('is_head_checked')) {
		    /* switch head-checkbox to false */
                    p3.head()[0].checked(false);
		}
                p3.select(p2, row_idx);
            }
            let row_index     = this.confmng('row-index');
            let add_row_comps = [
                new Check({
                    style: { 'width': '0.16rem', 'margin': 'auto' },
                    changeEvent: new ConfArg(chkbx_chg,this),
                    data: new ConfArg('row-index', row_index)
                })
            ];
            
            if (false === Array.isArray(prm)) {
                throw Error('invalid parameter')
            }
            
            for (let pidx in prm) {
                if (true === comutl.isinc(prm[pidx],'Text')) {
		    let txt_clr = prm[pidx].mainColor();
		    if (null === txt_clr) {
                        txt_clr = [80,80,80]
		    }
                    prm[pidx].effect([
                        new Color({ eid:2, color:[255,255,255], speed:300 }),
                        new Color({ eid:3, color:txt_clr,     speed:200 })
                    ]);
		}
                add_row_comps.push(prm[pidx]);
            }
            
            row_index++;
            this.confmng('row-index', row_index);

            super.insert(add_row_comps);
	} catch (e) {
            console.error(e.stack);
            throw e;
	}
    }
    
    accentColor (prm) {
        try {
            return this.confmng('accentColor', prm);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
/* end of file */
