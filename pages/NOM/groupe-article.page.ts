/**
 * Appli    : NOMENCLATURE
 * Page     : GROUPE ARTICLE
 * Onglet   : ---
 * 
 * @author  JOSIAS SIE
 * @version 3.1
 * 
 */

import { Page } from "@playwright/test"

export class GroupeArticle {

    public readonly buttonValeursAuto       = this.page.locator('footerBar button span.fa-edit');
    public readonly buttonDissocier         = this.page.locator('footerBar button span.fa-unlink');
    public readonly buttonPlageCodeArticle  = this.page.locator('footerBar button span.fa-umbrella-beach');
    public readonly buttonPlus              = this.page.locator('i.fa-plus');

    public readonly nodeGroupesArticles     = this.page.locator('[role="treeitem"]');

    public readonly labelBreadCrumb         = this.page.locator('ol.breadcrumb');

    public readonly inputAssocierCarac      = this.page.locator('app-autocomplete input');
    public readonly inputCaracteristique    = this.page.locator('div.p-datatable-header input');

    public readonly dataGridCarac           = this.page.locator('table th');

    //-- Popin : Paramétrage de la plage des codes article ------------------------------------------------------------------------------
    public readonly pCheckBoxAlphaNum       = this.page.locator('#alphanumerique');

    public readonly pInputPlageMin          = this.page.locator('#plageMin');
    public readonly pInputPlageMax          = this.page.locator('#plageMax');
    public readonly pInputCommencePar       = this.page.locator('#commencePar');
    public readonly pInputNeCommencePasPar  = this.page.locator('#neCommencePasPar');

    public readonly pButtonValider          = this.page.locator('.modal-footer button.btn-primary');
    public readonly pButtonAnnuler          = this.page.locator('.modal-footer button.btn-link');

    constructor(public readonly page: Page) {}
}