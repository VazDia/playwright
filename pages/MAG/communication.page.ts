/**
 * Page MAGASIN > COMMANDES
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * 
 */
import { Page} from '@playwright/test';

export class Communication {
    

    public readonly textareaMessageFr    = this.page.locator('textarea').nth(0);        
    public readonly textareaMessageIt    = this.page.locator('textarea').nth(1);        
    public readonly pSelectCouleurMessage= this.page.locator('p-selectbutton');   
    public readonly buttonTraduireMessage= this.page.locator('.bouton-traduction button');      
    public readonly buttonCommuniquer    = this.page.locator('.boutons-communication-utilisateurs button').nth(0);
    public readonly buttonSupprimer      = this.page.locator('.boutons-communication-utilisateurs button').nth(1);

    constructor(public readonly page: Page) {};
};