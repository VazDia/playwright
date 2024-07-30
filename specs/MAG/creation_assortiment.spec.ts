/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 06 - 12 - 2023
 */

const xRefTest      = "MAG_AUP_ASF";
const xDescription  = "Création d'un assortiment Achat Centrale";
const xIdTest       =  107;
const xVersion      = '3.6';

var info = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['groupeArticle', 'typeAssortiment', 'nomAssortiment', 'E2E'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page}                from '@playwright/test';

import { TestFunctions }                 from "@helpers/functions";
import { Log }                           from "@helpers/log";
import { Help }                          from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuMagasin }                   from '@pom/MAG/menu.page';
import { AutorisationsParametrage }      from '@pom/MAG/autorisations-parametrage.page';
import { AutorisationsAchatsCentrale }   from '@pom/MAG/autorisations-achats_centrale.page';

//-------------------------------------------------------------------------------------

let page          : Page;

let menu          : MenuMagasin;
let pageAutParam  : AutorisationsParametrage;
let pageAutoAC    : AutorisationsAchatsCentrale;

const log         = new Log();
const fonction    = new TestFunctions(log);

//----------------------------------------------------------------------------------------

fonction.importJdd();

var maDate              = new Date();    

const dateJour          = maDate.getFullYear().toString().slice(-2) + fonction.addZero(maDate.getMonth() + 1) + fonction.addZero(maDate.getDate());

const groupeArticle     = fonction.getInitParam('groupeArticle', 'Fruits et légumes');
const typeAssortiment   = fonction.getInitParam('typeAssortiment', 'Achats centrale');
const designationGroupe = fonction.getInitParam('nomAssortiment', 'TA_' + typeAssortiment + " " + groupeArticle + ' ' + dateJour + ':' + maDate.getDate().toString() + maDate.getHours());
// nomAssortiment
//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pageAutParam    = new AutorisationsParametrage(page);
    pageAutoAC      = new AutorisationsAchatsCentrale(page);
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
        
        var bAssortimentExiste = false;
        var pageName = 'autorisations';

        test('Page [AUTORISATIONS] - Click', async () => {
            await menu.click(pageName,page);
        })
        
        test.describe('*** VERIFICATION DE L\'EXISTENCE DE L\'ASSORTIMENT ', async () => {

            test('InpuField [ASSORTIMENT] = "' + designationGroupe + '"', async () =>{
                await fonction.sendKeys(pageAutoAC.inputAssortiment, designationGroupe);
            })

            test('Tr [ASSORTIMENT] = "' + designationGroupe + '" - Check', async () => {

                const iPosition:number = await fonction.getPositionByText(pageAutoAC.trAssortimentParRech, designationGroupe);

                log.set(' ------------------  VERIFICATION DE L\'EXISTENCE DE L\'ASSORTIMENT  --------------');
                if (iPosition > -1) {
                    log.set('L\'assortiment "' + designationGroupe + '" existe déjà');
                }else{
                    log.set('Aucun Assortiment correspond à "' + designationGroupe + '"');
                }
                log.separateur();

            })
            
        })

        test('Onglet [PARAMETRAGE] - Click', async () => {
            if(!bAssortimentExiste){

                log.set('-------------------------  CREATION DE L\'ASSORTIMENT  -------------------------');
                await menu.clickOnglet(pageName, 'parametrage', page);
            }else{

                log.set('Onglet [PARAMETRAGE] - Click : ACTION ANNULEE');
                test.skip();
            }
        })

        test.describe ('Onglet [PARAMETRAGE]', async () => {

            test('Button [CREER ASSORTIMENT] - Click', async () => { 
                if(!bAssortimentExiste){ 
                    await fonction.clickElement(pageAutParam.buttonCreerAssort);
                }else{
                    log.set('Button [CREER ASSORTIMENT] - Click : ACTION ANNULEE');
                    test.skip();
                }
            })

            test('CheckBox [TYPE] = "' + typeAssortiment + '"', async () => {   
                if(!bAssortimentExiste){
                    var iNbChoix = await pageAutParam.checkBoxTypeLabel.count();
                    for(let elmt = 0; elmt < iNbChoix; elmt++){

                        var sText = await pageAutParam.checkBoxTypeLabel.nth(elmt).textContent();
                        if(sText?.trim() == typeAssortiment){

                            await pageAutParam.checkBoxTypeLabel.nth(elmt).check();
                            break;
                        }
                    }  
                }else{
                    log.set('CheckBox [TYPE] = "' + typeAssortiment + '" : ACTION ANNULEE');
                    test.skip();
                }   
            })

            test('ListBox [GROUPE ARTICLE] = "' + groupeArticle + '"', async () => {  
                if(!bAssortimentExiste){ 
                    await fonction.listBoxByLabel(pageAutParam.listBoxOrigine, groupeArticle, page);  
                }else{
                    log.set('ListBox [GROUPE ARTICLE] = "' + groupeArticle + '" : ACTION ANNULEE');
                    test.skip();
                }                       
            })  

            test('InputField [DESIGNATION] = "' + designationGroupe + '"', async () => {  
                if(!bAssortimentExiste){   
                    await fonction.sendKeys(pageAutParam.inputDesignation, designationGroupe);
                }else{
                    log.set('InputField [DESIGNATION] = "' + designationGroupe + '" : ACTION ANNULEE');
                    test.skip();
                }                                                            
            })

            test('Button [ENREGISTRER] - Click', async () => {   
                if(!bAssortimentExiste){
                    await fonction.clickAndWait(pageAutParam.buttonEnregistrer, page);
                    log.set('Opération a été effectuée avec succès : l\'assortiment est maintenant créé');
                }else{
                    log.set('Button [ENREGISTRER] - Click : ACTION ANNULEE');
                    test.skip();
                }
            })      

            test('Label [ERREUR] - Is NOT Visible', async () => {
                if(!bAssortimentExiste){
                    await fonction.isErrorDisplayed(false, page);
                }else{
                    log.set('Label [ERREUR] - Is NOT Visible : VERIFICATION ANNULEE ');
                    test.skip();
                }
            }) 
        })
        // fonction.writeData(oData);
    })

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });
})