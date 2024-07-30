/**
 * 
 * JDD - Cycle de vie de la céation d'un client dans Sigale société.
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * @since 2023-11-20
 * @see E2E_SOC_CGF
 * 
 */

import { TestFunctions } from "@helpers/functions";

export class Init {
    
    private data = {
        raisonSociale  : '',
        designation    : '',
        sCodeClient    : '',
        sDirectionExp  : '',
        sRegion        : '',
        sSecteur       : '',
        tmpFilename    : ''
    };

    constructor(fonction: TestFunctions) {
        this.data.tmpFilename = fonction.getPrefixeEnvironnement() + '_E2E_SOC_CGF-' + fonction.getToday('us') + '.json';
    }

    public getData () {
        return this.data;
    }

}

module.exports = Init;