/**
 * Appli    : NOMENCLATURE
 * Page     : CARACTERISTIQUES
 * Onglet   :
 * 
 * @author  JOSIAS SIE
 * @version 3.0
 * 
 */

import { Page } from "@playwright/test"

export class Caracteristique {

    public readonly dataGridCarac           = this.page.locator('table th');
    public readonly inputSearchDesignation  = this.page.locator('.global-filter input');
    public readonly buttonCreerCarac        = this.page.locator('.footerBar button span.fa-plus');
    public readonly buttonModifierCarac     = this.page.locator('.footerBar button span.fa-edit');
    public readonly buttonSupprimerCarac    = this.page.locator('.footerBar button span.fa-trash-alt');
    public readonly buttonSupprimerValeur   = this.page.locator('.footerBar button span.fa-times');

    //-- Popin : Création d'une caractéristique -------------------------------------------------------------------------------------
    public readonly pInputDesignation       = this.page.locator('#designation');
    public readonly pListBoxTypeCarac       = this.page.locator('#type');
    public readonly pTexteAreaDescription   = this.page.locator('#caracDescription');
    public readonly pButtonCreer            = this.page.locator('#footerAjoutCaracteristique button.btn-md');
    public readonly pButtonAnnuler          = this.page.locator('#footerAjoutCaracteristique button.btn-link');

    constructor(public readonly page: Page) {}
}