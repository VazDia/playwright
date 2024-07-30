/**
 * Appli    : STOCK
 * Menu     : REFERENTIEL
 * Onglet   : EMPLACEMENTS
 * 
 * author JOSIAS SIE
 * 
 * @version 3.0
 * 
 */


import { Page }          from "@playwright/test";

export class ReferentielEmplacements{

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly buttonZones                = this.page.locator('button em.icon-th-large');
    public readonly buttonAllees               = this.page.locator('button em.icon-align-justify');
    public readonly buttonEmplacements         = this.page.locator('button em.icon-th');
    public readonly buttonRecalculerOrdre      = this.page.locator('button em.icon-resize-vertical');

    //-- Hover
    public readonly buttonCreerZone            = this.page.locator('div.button-with-popover-container:nth-child(1) em.pi-plus');
    public readonly buttonModifierZone         = this.page.locator('div.button-with-popover-container:nth-child(1) em.pi-pencil');
    public readonly buttonSupprimerZone        = this.page.locator('div.button-with-popover-container:nth-child(1) em.pi-times');     

    //-- Hover
    public readonly buttonCreerAllee           = this.page.locator('div.button-with-popover-container:nth-child(2) em.pi-plus');
    public readonly buttonModifierAllee        = this.page.locator('div.button-with-popover-container:nth-child(2) em.pi-pencil');
    public readonly buttonSupprimerAllee       = this.page.locator('div.button-with-popover-container:nth-child(2) em.pi-times');    
       
    //-- Hover
    public readonly buttonCreerEmplacemt       = this.page.locator('div.button-with-popover-container:nth-child(3) em.pi-plus');
    public readonly buttonModifierEmplacemt    = this.page.locator('div.button-with-popover-container:nth-child(3) em.pi-pencil');
    public readonly buttonSupprimerEmplacemt   = this.page.locator('div.button-with-popover-container:nth-child(3) em.pi-times');       

    public readonly dataGridZones              = this.page.locator('app-table-emplacements.table-emplacements p-table thead tr:nth-child(1) th');

    public readonly tdLibelleZones             = this.page.locator('td.colonne-designation');

    //-- Popin "Création d'une zone" --------------------------------------------------------------------------------
    public readonly pPopin                     = this.page.locator('.modal-backdrop');

    public readonly pButtonEnregistrer         = this.page.locator('div.p-dialog-footer button.btn-primary');

    public readonly pLinkAnnuler               = this.page.locator('div.p-dialog-footer button.btn-link');

    public readonly pInputDesignation          = this.page.locator('#designationZone');
    public readonly pInputDesignationAllee     = this.page.locator('#designationAlleeStockage');
    public readonly pPdropdownZone             = this.page.locator('#zone');
    public readonly pPdropdownAllee            = this.page.locator('#allee');
    public readonly pInputEmplacement          = this.page.locator('#designationEmplacement');
    public readonly pDropdownOrdreAffichage    = this.page.locator('#ordreAffichage');
    public readonly pInputCapaciteMax          = this.page.locator('#capaciteMax');
    public readonly pInputVolume               = this.page.locator('#volume');
    public readonly pInputRackDynamique        = this.page.locator('#rackDynamique');
    public readonly pInputActif                = this.page.locator('#actif');
    //----------------------------------------------------------------------------------------------------------------    
    constructor(public readonly page: Page) {}  
}