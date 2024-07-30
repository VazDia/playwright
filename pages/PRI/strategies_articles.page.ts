/**
 * 
 * PRICING PAGE > STRATEGIES ARTICLES
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page, test } from "@playwright/test"

export class StrategiesArticlesPage {
    
    public readonly buttonEnregistrer                                   :Locator  //'button span.icon-pencil');

    public readonly listBoxGroupeArticle                                :Locator  //'groupeArticle');
    public readonly listBoxGroupeMagasins                               :Locator  //'groupeMagasin');
    
    public readonly dataGridListeArticles                               :Locator  //'p-table[datakey="code"] th.text-center'); 
    public readonly dataGridListeGroupesMagasins                        :Locator  //'p-table[datakey="id"] th.text-center'); 

    
    constructor(page: Page){

        this.buttonEnregistrer                                          = page.locator('button span.icon-pencil');

        this.listBoxGroupeArticle                                       = page.locator('[for="groupeArticle"]');
        this.listBoxGroupeMagasins                                      = page.locator('[for="groupeMagasin" ]');
    
        this.dataGridListeArticles                                      = page.locator('p-table[datakey="code"] th.text-center'); 
        this.dataGridListeGroupesMagasins                               = page.locator('p-table[datakey="id"] th.text-center'); 
    }
}