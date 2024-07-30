/**
 * Appli    : MAGASIN
 * Page     : REFERENTIEL
 * Onglet   : UTILISATEURS
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * 
 */
import { Page } from '@playwright/test';

export class ReferentielParametrage{

    public readonly buttonEnregistrer  = this.page.locator('.form-btn-section .containerBT button');

    public readonly dataGridParametrage= this.page.locator('p-table .p-datatable-wrapper table > thead.p-datatable-thead > tr').nth(0).locator('th');
 

    constructor(public readonly page: Page) {}
    
}