/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 23 - 04 - 2024
 */

const xRefTest      = "MAG_ENG_ADD";
const xDescription  = "Associer un article à un Engagement";
const xIdTest       =  1039;
const xVersion      = '3.0';

var info:CartoucheInfo = {
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

import { expect, test, type Page}        from '@playwright/test';

import { TestFunctions }                 from '@helpers/functions';
import { Log }                           from '@helpers/log';
import { Help }                          from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuMagasin }                   from '@pom/MAG/menu.page';
import { AutorisationsEngagements }      from '@pom/MAG/autorisations-engagements.page';
import { AutorisationsAchatsCentrale }   from '@pom/MAG/autorisations-achats_centrale.page.js';
import { AutoComplete }                  from '@commun/types';

import { CartoucheInfo }                 from '@commun/types';
//-------------------------------------------------------------------------------------

let page                : Page;

let menu                : MenuMagasin;
let pageAutEngag        : AutorisationsEngagements;
var pageAutoAchCentrale : AutorisationsAchatsCentrale;

const log               = new Log();
const fonction          = new TestFunctions(log);

var articlesCibles      = ['M003', 'M00D', 'M00A'];
//----------------------------------------------------------------------------------------

// Attention : Doit porter le même nom que le Test "creation_modele_commande.spec.js"
var sGroupeArticle             = fonction.getInitParam('groupeArticle','Fruits et légumes');
const sNomEngagement           = 'TEST-AUTO_engagement-' + fonction.getToday('FR') 
const sDesignationAssortiment  = sNomEngagement + ' (' + sGroupeArticle +')';

//-----------------------------------------------------------------------------------------   
test.beforeAll(async ({ browser }) => {
    page                = await browser.newPage(); 
    menu                = new MenuMagasin(page, fonction);
    pageAutEngag        = new AutorisationsEngagements(page);
    pageAutoAchCentrale = new AutorisationsAchatsCentrale(page);
})
 
test.afterAll(async () => {
    await fonction.close();
})

//-----------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
    });

    test('Ouverture URL', async() => {
        await fonction.openUrl(page);
    })

    test('Connexion', async () => {
        await fonction.connexion(page);
    })

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

        var pageName         = 'autorisations';

        test('Page [AUTORISATIONS] - Click', async () => {
            await menu.click(pageName,page);
        })

        test('Label [ERREUR][0] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        })
        
        test.describe('Onglet [ENGAGEMENTS] >', async () =>  {     

            test('Onglet [ENGAGEMENTS] - Click', async () =>  {       
                await menu.clickOnglet(pageName, 'engagements', page);
            })

            test('Label [ERREUR][0] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de l'onglet
                await fonction.isErrorDisplayed(false, page);
            })   
            
            test('InputField [ASSORTIMENT] = "' + sNomEngagement + '"', async () => {
                await fonction.sendKeys(pageAutEngag.inputAssortiment, sNomEngagement);
                await fonction.wait(page, 500);

            })

            test('CheckBox [LISTE ASSORTIMENTS][' + sDesignationAssortiment + '] - Click', async () =>  {
                var iNbLibelleAssort = await pageAutEngag.checkBoxListeAssort.count();
                if(iNbLibelleAssort > 0) {

                    for ( let iLibelleAssort = 0 ; iLibelleAssort < iNbLibelleAssort; iLibelleAssort++){

                        var sCible = await pageAutEngag.checkBoxListeAssort.nth(iLibelleAssort).textContent();
                        if(sCible.includes(sDesignationAssortiment)){ 

                            await fonction.clickAndWait(pageAutEngag.checkBoxListeAssort.nth(iLibelleAssort), page);
                            break;  
                        }else if((iLibelleAssort == iNbLibelleAssort - 1) && !sCible.includes(sDesignationAssortiment)){

                            throw new Error('Acune correspondance à Saprimex dans la liste de commande');
                        }
                    }
                }else{

                    throw new Error('AUCUNE COMMANDE EXISTANTE');
                }
            })

            test('** Suppression Conditionnelle **', async () =>  {
                // Si le test a déjà été lancé, il se peut que l'article soit déjà associé à l'engagement.
                // On supprime donc tous les articles déjà présents
                var text = await pageAutEngag.labelNbArticles.textContent()
                if (!text.includes('0')) {

                    // Click sur la checkBoxAll s'il existe au moins un article
                    await fonction.clickElement(pageAutEngag.checkBoxAllArticles); 
                    await fonction.clickAndWait(pageAutEngag.buttonSupprimerLigne, page);

                    // popin "Confirmer la suppression"
                    var visibility = await pageAutEngag.popin.isVisible();
                    expect(visibility).toBe(true);      

                    await fonction.clickAndWait(pageAutEngag.pPButtonOui, page);  

                    expect(pageAutEngag.popin).not.toBeVisible();                        
                }
            })

            test.describe ('** Association Articles **', async () =>  {

                articlesCibles.forEach((data:string) => {

                    test('InputField [ARTICLE] = "' + data + '"', async () => {
                        var oData:AutoComplete = {
                            libelle         :'ARTICLE',
                            inputLocator    : pageAutEngag.inputArticle,
                            inputValue      : data.toString(),
                            choiceSelector  :'div.autocomplete-article app-autocomplete button.dropdown-item:last-child',
                            choicePosition  : 0,
                            typingDelay     : 150,
                            waitBefore      : 750,
                            page            : page,
                        };
                        await fonction.autoComplete(oData);
                    })

                    test.describe ('Saisie Article : ' + data, async () =>  {

                        test('Button [ + ] - Click', async () =>  {                       
                            await fonction.clickAndWait(pageAutEngag.buttonPlus, page);
                        })

                        var sNomPopin = 'ENREGISTREMENT D\'UNE LIGNE DE l\'ASSORTIMENT ' + sNomEngagement;

                        test.describe ('Popin : [' + sNomPopin + ']', async () =>  {

                            test('Popin [' + sNomPopin + '] - Is Visible', async () => {
                                await fonction.popinVisible(page, sNomPopin, true);
                            })

                            test('Select [CALIBRE] [CONDITIONNEMENT]', async () => {
                                var iNbChoixCalibre = await pageAutEngag.pPListBoxCalibre.locator('option').count();
                                var aNomCalibre = await pageAutEngag.pPListBoxCalibre.locator('option').allTextContents();

                                for(var iNb = 0; iNb < iNbChoixCalibre; iNb++){
     
                                    var sNomCalibre = aNomCalibre[iNb];

                                    if(sNomCalibre !=''){
     
                                        await pageAutEngag.pPListBoxCalibre.selectOption({index: iNb});
                                        await fonction.wait(page, 1000);
                                        var iNbChoixConditionnement = await pageAutEngag.pPListBoxCond.locator('option').count();
                                        var iIndexSelectionne        = iNbChoixConditionnement - 1 ;
                                        var sNomConditionnement = await pageAutEngag.pPListBoxCond.locator('option').nth((iIndexSelectionne)).textContent();
                                        if(sNomConditionnement !=''){
                                      
                                            await pageAutEngag.pPListBoxCond.selectOption({index: (iIndexSelectionne)});
                                            log.set('Conditionnement : ' + sNomConditionnement);
                                            break;
                                        }
                                    }
                                }
                                log.set('Calibres disponibles : ' + iNbChoixCalibre);
                            })
              
                            test('CheckBox [ALL MAGASINS] - Click', async () =>  {                        
                                await fonction.clickElement(pageAutEngag.pPCheckBoxAllMag);
                            })

                            test('Button [ENREGISTRER] - Click', async () =>  {
                                await fonction.clickAndWait(pageAutEngag.pPButtonEnregsitrer, page);
                            })

                            test('Popin [' + sNomPopin + '] - Is Not Visible', async () => {
                                await fonction.popinVisible(page, sNomPopin, false);
                            })
                        })
                    })
                })
            })
        })  // En describe Onglet
    }) // En describe Page

    test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})
})