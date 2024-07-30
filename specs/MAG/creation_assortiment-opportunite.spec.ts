/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 06 - 12 - 2023
 */

const xRefTest      = "MAG_OPP_NEW";
const xDescription  = "Création d'un assortiment de type Opportunité";
const xIdTest       =  2664;
const xVersion      = '3.2';

var info = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['groupeArticle'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page}                from '@playwright/test';

import { TestFunctions }                 from "../../utils/functions";
import { Log }                           from "../../utils/log";
import { Help }                          from '../../utils/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuMagasin }                   from '../../pages/MAG/menu.page';
import { AutorisationsParametrage }      from '../../pages/MAG/autorisations-parametrage.page';
import { AutorisationsOppotunites }      from '../../pages/MAG/autorisations-opportunites.page';

//-------------------------------------------------------------------------------------

let page          : Page;

let menu          : MenuMagasin;
let pageAutParam  : AutorisationsParametrage;
let pageAutoOpp   : AutorisationsOppotunites;

const log         = new Log();
const fonction    = new TestFunctions(log);

//----------------------------------------------------------------------------------------

var maDate               = new Date();    

const groupeArticle      = fonction.getInitParam('groupeArticle','Fruits et légumes');

const typeAssortiment    = 'Opportunité';
const dateJour           = maDate.getFullYear().toString().slice(-2) + '-' + fonction.addZero(maDate.getMonth() + 1) + '-' + fonction.addZero(maDate.getDate())
const sDesignationGroupe = 'TEST-AUTO_Opportunité ' + groupeArticle + ' ' + dateJour;

const sHeureDebut        = '23';
const sMinuteDebut       = '59';

//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pageAutParam    = new AutorisationsParametrage(page);
    pageAutoOpp     = new AutorisationsOppotunites(page);
});
 
test.afterAll(async () => {
    await fonction.close();
})

//-----------------------------------------------------------------------------------------

test.describe.configure({ mode: 'serial' });

test.describe ('[' + xRefTest + ']', () => {

    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
    });

    test('Ouverture URL', async() => {
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [ACCUEIL]', async () => {

        test('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
            if(isVisible){
                await menu.removeArlerteMessage();
            }else{
                log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
                test.skip();
            }
        })
    })

    test.describe('Page [AUTORISATIONS]', () => {
        
        var pageName = 'autorisations';

        test('Page [AUTORISATIONS] - Click', async () => {
            await menu.click(pageName,page);
        })

        test.describe ('Onglet [PARAMETRAGE]', () => {

            test('Onglet [PARAMETRAGE] - Click', async () => {
                log.set('-------------------------  CREATION DE L\'ASSORTIMENT  -------------------------');
                await menu.clickOnglet(pageName, 'parametrage', page);
            })

            test('Button [CREER ASSORTIMENT] - Click', async () => {  
                await fonction.clickAndWait(pageAutParam.buttonCreerAssort, page);
            })

            test('CheckBox [TYPE] = "' + typeAssortiment + '"', async () => { 
                var iNbChoix = await pageAutParam.checkBoxTypeLabel.count();
                for(let elmt = 0; elmt < iNbChoix; elmt++){

                    var sText = await pageAutParam.checkBoxTypeLabel.nth(elmt).textContent();
                    if(sText.trim() === typeAssortiment){

                        await pageAutParam.checkBoxTypeLabel.locator('input').nth(elmt).check();
                        break;
                    }
                }  
            })                   

            test('ListBox [GROUPE ARTICLE] = "' + groupeArticle + '"', async () => {   
                await fonction.listBoxByLabel(pageAutParam.listBoxOrigine, groupeArticle, page);                      
            })  

            test('InputField [DESIGNATION] = "' + sDesignationGroupe + '"', async () => {     
                await fonction.sendKeys(pageAutParam.inputDesignation, sDesignationGroupe);                                                             
            })        
            
            test('DatePicker [FIN DE SAISIE] = "' + dateJour + '"', async () => {
                await pageAutParam.datePickerFinSaisieIcon.click();
                await pageAutParam.datePickerTodayOpport.click();
            })

            test('InputField [HEURE DEBUT] = "' + sHeureDebut + '"', async () => {
                await fonction.sendKeys(pageAutParam.inputHeureDebutOpport,   sHeureDebut);
            })

            test('InputField [MINUTE DEBUT] = "'+sMinuteDebut+'"', async () => {
                await fonction.sendKeys(pageAutParam.inputMinuteDebutOpport,  sMinuteDebut);   
            })

            test('DatePicker [EXPEDITION] = "Last Day of the month"', async () => {
                await pageAutParam.datePickerExpeditionIcon.click();
                await pageAutParam.datePickerActiveDay.last().click();
            })

            test('Button [ENREGISTRER] - Click', async () => {   
                await fonction.clickAndWait(pageAutParam.buttonEnregistrer, page);
                log.set('Opération a été effectuée avec succès : l\'assortiment est maintenant créé');
            })        

            test('Label [ERREUR] - Is NOT Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            }) 
        })
    })
    
    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

})