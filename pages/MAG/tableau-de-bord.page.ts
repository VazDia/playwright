/**
 * Appli    : MAGASIN
 * Page     : TABLEAU DE BORD
 * Onglet   : ---
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * 
 */
import { Page} from '@playwright/test';

export class TableauDeBord {

    public readonly datePicker           = this.page.locator('p-calendar button');
    public readonly buttonVoirPhotos     = this.page.locator('div.form-btn-section button i.fa-camera');
    public readonly buttonValider        = this.page.locator('div.form-btn-section button i.fa-thumbs-up');
    public readonly buttonRefuser        = this.page.locator('div.form-btn-section button i.fa-thumbs-down');
    public readonly dataGridDemandesAvoir= this.page.locator('p-table tr:nth-child(1) th');

    constructor(public readonly page: Page) {}
}