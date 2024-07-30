/**
 * 
 * PRICING PAGE > ALIGNEMENTS
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.1
 * 
 */

import { Locator, Page, test } from "@playwright/test"

export class AlignementsPage {
    public page                                                     : Page
    public readonly buttonAccorder                                  : Locator  //'button em.icon-thumbs-up');

    public readonly datePickerAlignementRecus                       : Locator  //'input-date-alignements');
    public readonly datePickerNextMonth                             : Locator  //'span.p-datepicker-next-icon');
    public readonly datePickerAvailableDay                          : Locator  //'table.p-datepicker-calendar tbody td:NOT(.p-datepicker-other-month');

    public readonly inputCodeMagasinMagasin                         : Locator  //'div.alignements-magasin th input.p-inputtext').nth(0);
    public readonly inputCodeMagasinArticle                         : Locator  //'div.demandes-alignement th input.p-inputtext').nth(0);
    public readonly inputCodeArticleMagasin                         : Locator  //'div.alignements-magasin th input.p-inputtext').nth(1);
    public readonly inputCodeArticleArticle                         : Locator  //'div.demandes-alignement th input.p-inputtext').nth(1);

    public readonly checkBoxMasquerMagSansAlign                     : Locator  //'[inputid="toggle-masquer-magasins"]');
    public readonly checkBoxMasquerAlignRepondu                     : Locator  //'[inputid="toggle-masquer-alignements"]');    
    public readonly checkBoxMagasin                                 : Locator  //'td div[role="checkbox"]');

    public readonly dataGridListeMagasins                           : Locator  //'div.alignements-magasin th.text-center'); 
    public readonly dataGridListeArticles                           : Locator  //'div.demandes-alignement th.text-center'); 

    public readonly tdColActionDdeAlign                             : Locator  //'div.demandes-alignement td.col-actions');

    public readonly pictogramRefuser                                : Locator  //'em.fa-thumbs-down');

    constructor(page:Page){

        this.buttonAccorder                                         = page.locator('button em.icon-thumbs-up');

        this.datePickerAlignementRecus                              = page.locator('[for="input-date-alignements"]');
        this.datePickerNextMonth                                    = page.locator('span.p-datepicker-next-icon');
        this.datePickerAvailableDay                                 = page.locator('table.p-datepicker-calendar tbody td:NOT(.p-datepicker-other-month)');
    
        this.inputCodeMagasinMagasin                                = page.locator('div.alignements-magasin th input.p-inputtext').nth(0);
        this.inputCodeMagasinArticle                                = page.locator('div.demandes-alignement th input.p-inputtext').nth(0);
        this.inputCodeArticleMagasin                                = page.locator('div.alignements-magasin th input.p-inputtext').nth(1);
        this.inputCodeArticleArticle                                = page.locator('div.demandes-alignement th input.p-inputtext').nth(1);
    
        this.checkBoxMasquerMagSansAlign                            = page.locator('[inputid="toggle-masquer-magasins"]');
        this.checkBoxMasquerAlignRepondu                            = page.locator('[inputid="toggle-masquer-alignements"]');    
        this.checkBoxMagasin                                        = page.locator('td div[role="checkbox"]');
    
        this.dataGridListeMagasins                                  = page.locator('div.alignements-magasin th.text-center'); 
        this.dataGridListeArticles                                  = page.locator('div.demandes-alignement th.text-center');
    
        this.tdColActionDdeAlign                                    = page.locator('div.demandes-alignement td.col-actions');
    
        this.pictogramRefuser                                       = page.locator('em.fa-thumbs-down');
    }
}