/**
 * 
 * 
 * @author JC CALVIERA
 * @since 2023-11-08
 * 
 */
const xRefTest      = "ACH_FAC_ARR";
const xDescription  = "Modifier le numéro de BL d'un arrivage";
const xIdTest       =  238;
const xVersion      = '3.2';

var info = {
    desc    : xDescription,
    appli   : 'ACH',
    version : xVersion,
    refTest : [xRefTest],
    idTest  : xIdTest,
    help    : [],
    params  : ['idFournisseur'],
    fileName: __filename
};

//------------------------------------------------------------------------------------
import { test, type Page, expect }  from '@playwright/test';

//-- Helpers
import { Help }             from '@helpers/helpers';
import { TestFunctions }    from '@helpers/functions';
import { Log }              from '@helpers/log'

import { MenuAchats }       from '@pom/ACH/menu.page';
import { PageHisArrLot }    from '@pom/ACH/historique_arrivages-lots.page';
import { AutoComplete }     from '@commun/types';

//------------------------------------------------------------------------------------

let page            : Page;
let menu            : MenuAchats;

let pageHisArr      : PageHisArrLot;

var log             = new Log();
var fonction        = new TestFunctions(log);

//------------------------------------------------------------------------------------
const sFournisseur  = process.env.IDFOURNISSEUR ||'00015';  // 00015 - Fruidor lyon
const sRayon        = 'Fruits et légumes';
const sUpdated      = ' - Updated ! \' < % #';
//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page            = await browser.newPage();
    menu            = new MenuAchats(page, fonction);
    pageHisArr      = new PageHisArrLot(page);
});

test.afterAll(async() =>{
    log.get();
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
    });

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async() => {
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [HISTORIQUE]', () => {

        var sPageName = 'historique';

        var sLibelleModifie = '';
        var sAchat:string | null = null;
        var sArticle:string | null = null;
        var sQuantite:string | null = null;

        test('ListBox [RAYON] = "' + sRayon + '"', async () => {
            await menu.selectRayonByName(sRayon, page);
        })

        test('Page [HISTORIQUE] - Click', async () => {
            await menu.click(sPageName, page); 
        })
       
        test ('Error Message - Is Hidden', async () =>  {
            await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de la popin
        })

        test ('AutoComplete [FOURNISSEUR] = "' + sFournisseur + '"', async () =>  {

            const autoComplete:AutoComplete = {
                libelle         : 'Fournisseur',
                inputLocator    : pageHisArr.inputFournCommande,
                inputValue      : sFournisseur,
              //choiceSelector  : 'li.gfit-autocomplete-result',
              //choicePosition  : 0;
              //verbose         : true,
              //typingDelay     : 100,
              //waitBefore      : 500,
                page            : page
            }

            await fonction.autoComplete(autoComplete);
        })

        test ('Button [RECHERCHER (#1)] - Click', async () => {
            await fonction.clickElement(pageHisArr.buttonRechercher);
        })

        test ('DataGrid [LOTS][first] - Is Visible', async () => {    // Attente affichage des résultats
            await pageHisArr.dataGridAchats.first().waitFor();
        })  

        test ('CheckBox [ARRIVAGES SANS FACTURE] - Click', async () => {
            await fonction.clickElement(pageHisArr.checkBoxArrivageSansFacture);
        })

        test ('td [LOT][rnd] - Click', async () => {

            await pageHisArr.tdLotNumeroAchat.first().waitFor();

            const iNbLignes = await pageHisArr.tdLotNumeroAchat.count();
            const iRnd = Math.floor(fonction.random() * iNbLignes);

            sArticle = await pageHisArr.tdLotArticle.nth(iRnd).textContent();           
            log.set('Article Sélectionné : ' + sArticle?.toString());

            sAchat = await pageHisArr.tdLotNumeroAchat.nth(iRnd).textContent();
            log.set('Achat Sélectionné : ' + sAchat);

            const sRefLot = await pageHisArr.tdLotNumeroLot.nth(iRnd).textContent();
            log.set('Lot Sélectionné : ' + sRefLot);

            sQuantite = await pageHisArr.tdLotQuantiteUA.nth(iRnd).textContent();
            log.set('Quantité en UA Sélectionnée : ' + sQuantite?.toString());            

            fonction.clickElement(pageHisArr.tdLotNumeroAchat.nth(iRnd));
        })

        var sNomPopin = "Modifier le BL des arrivages";
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () =>  {

            test('Button [MODIFIER LE BL] - Click', async () =>  {
                await fonction.clickAndWait(pageHisArr.buttonModifierBL, page);        
                await fonction.popinVisible(page, sNomPopin);    
            })

            test ('Error Message - Is Hidden', async () =>  {
                await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de la popin               
            })

            test ('InputField [CORRECTION BL] = "*' + sUpdated + '"', async () =>  {

                const sLibelleInitial = await pageHisArr.pPinputModifBL.inputValue();
                log.set('Valeur initiale : ' + sLibelleInitial);

                sLibelleModifie = sLibelleInitial + sUpdated;
                pageHisArr.pPinputModifBL.fill(sLibelleModifie);
                log.set('Nouvelle Valeur : ' + sLibelleModifie);

            })

        })

        test ('Button [ENREGISTRER] - Click', async () =>  {
            await fonction.clickAndWait(pageHisArr.pPbuttonModifBLEnregistrer, page);        
            await fonction.popinVisible(page, sNomPopin, false);    
        })  

        test ('InputField [ARTICLE] = "{Id Article}"', async () =>  {
            await fonction.sendKeys(pageHisArr.inputFiltreArticle, sArticle!);
        }) 
        
        test ('InputField [ACHAT] = "{Achat}"', async () =>  {
            await fonction.sendKeys(pageHisArr.inputFiltreAchat, sAchat!);
        }) 

        test ('InputField [BL] = "{Libellé Modifié}"', async () =>  {
            await fonction.sendKeys(pageHisArr.inputFiltreBL, sLibelleModifie);
        })
       

        test ('Button [RECHERCHER (#2)] - Click', async () => {
            await fonction.clickAndWait(pageHisArr.buttonRechercher, page);
        })

        test ('td nombre [LOTS] = 1', async () => {
            fonction.wait(page, 500);
            expect(await pageHisArr.tdLotNumeroAchat.count()).toBeGreaterThanOrEqual(1);
        })


    })  // End Describe Page

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

})