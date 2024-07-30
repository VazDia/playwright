/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 03 - 05 - 2024
 */

const xRefTest      = "MAG_ASS_DEL";
const xDescription  = "Suppression d'un Assortiment";
const xIdTest       =  223;
const xVersion      = '3.0';

var info = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : [],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { expect, test, type Page}                from '@playwright/test';

import { TestFunctions }                 from "@helpers/functions";
import { Log }                           from "@helpers/log";
import { Help }                          from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuMagasin }                   from '@pom/MAG/menu.page';
import { AutorisationsParametrage }      from '@pom/MAG/autorisations-parametrage.page';

//-------------------------------------------------------------------------------------

let page          : Page;

let menu          : MenuMagasin;
let pageAutParam  : AutorisationsParametrage;

const log         = new Log();
const fonction    = new TestFunctions(log);

//----------------------------------------------------------------------------------------
var maDate              = new Date();    

const dateJour          = maDate.getFullYear().toString().slice(-2) + fonction.addZero(maDate.getMonth() + 1) + fonction.addZero(maDate.getDate());

const groupeArticle     = fonction.getInitParam('groupeArticle', 'Fruits et légumes');
const typeAssortiment   = fonction.getInitParam('typeAssortiment', 'Achats centrale');
const sDesignationGroupe = fonction.getInitParam('nomAssortiment', 'TA_' + typeAssortiment + " " + groupeArticle + ' ' + dateJour + ':' + maDate.getDate().toString() + maDate.getHours());

var oCpt = {
    iCpt : null,
}

var getCpt = () => {
    return oCpt.iCpt;
}

var setCpt = (valeur:any) => {
    oCpt.iCpt = valeur;
}

//------------------------------------------------------------------------------------   
test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pageAutParam    = new AutorisationsParametrage(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
});
 
test.afterAll(async () => {
    await fonction.close();
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
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

    test.describe('Page [AUTORISATIONS]', async () => {
        
        var pageName = 'autorisations';

        test('Page [AUTORISATIONS] - Click', async () => {
            await menu.click(pageName,page);
        })

        test.describe('Onglet [PARAMETRAGE]', async () => {

            test('Onglet [PARAMETRAGE] - Click', async () =>  {                            
                await menu.clickOnglet(pageName, 'parametrage', page);
            })
    
            test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de l'onglet
                await fonction.isErrorDisplayed(false, page);
            })
            
            test('InputField [ASSORTIMENT] = "' + sDesignationGroupe + '"', async () => {
                await fonction.sendKeys(pageAutParam.inputFieldFilter, sDesignationGroupe);
                await fonction.wait(page, 500);
            })
    
            test('CheckBox [ASSORTIMENT][First] - Click', async () =>  {                  
                var iNbAssort = await pageAutParam.checkBoxListeAssortiments.count();
                setCpt(iNbAssort);
                log.set('Nombre d\'assortiments Initiaux : ' + iNbAssort);
                await fonction.clickAndWait(pageAutParam.checkBoxListeAssortiments.first(), page);                                 
            })
    
            test.describe('Popin [CONFIRMER LA SUPRESSION] (1)', async () =>  {
                
                test('Bouton [SUPPRIMER ASSORTIMENT] - Click', async () =>  {         
                    await fonction.clickAndWait(pageAutParam.buttonSupprimerAssort, page);                                                
                })
    
                test('Popin [CONFIRMER LA SUPRESSION] - Is Visible', async () => {
                    await fonction.popinVisible(page, 'CONFIRMER LA SUPRESSION', true);
                })
    
                test('Pictogramme [CLOSE] - Click', async () =>  {                                                 
                    await fonction.clickAndWait(pageAutParam.pPictoClose, page);                                      
                })
                
                test('Popin [CONFIRMER LA SUPRESSION] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, 'CONFIRMER LA SUPRESSION', false);
                })
            }) // end describe Popin
    
            test.describe('Popin [CONFIRMER LA SUPRESSION] (2)', async () =>  {
        
                test('Bouton [SUPPRIMER ASSORTIMENT] - Click', async () =>  {            
                    await fonction.clickAndWait(pageAutParam.buttonSupprimerAssort, page);                   
                })                       
                
                test('Popin [CONFIRMER LA SUPRESSION] - Is Visible', async () => {
                    await fonction.popinVisible(page, 'CONFIRMER LA SUPRESSION', true);
                })
    
                test('Bouton [OUI] - Click', async () =>  {                   
                    await fonction.clickAndWait(pageAutParam.pButtonOui, page);                   
                })
    
                test('Popin [CONFIRMER LA SUPRESSION] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, 'CONFIRMER LA SUPRESSION', false);
                })
    
                test('Check Nb Assortiments Restants', async () => { 
                    var iNbAssort = await pageAutParam.checkBoxListeAssortiments.count();
                    log.set('Nombre d\'assortiments Présents : ' + iNbAssort);
                    expect(iNbAssort).toEqual(getCpt() - 1);
                }) 
            }) // end Popin
        }) // end Onglet
    })  // end page

    test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})
})