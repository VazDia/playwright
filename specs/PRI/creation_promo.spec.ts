/**
 * @desc Création d'une Promotion
 * 
 * @author SIAKA KONE
 *  Since 2024-04-18
 */

const xRefTest      = "PRI_PRO_POI";
const xDescription  = "Création d'une Promotion";
const xIdTest       =  1931;
const xVersion      = '3.2';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PRI',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['rayon','codeArticle','villeRef'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page}       from '@playwright/test';

import { TestFunctions }        from "@helpers/functions";
import { Log }                  from "@helpers/log";
import { Help }                 from '@helpers/helpers';
import { EsbFunctions }         from '@helpers/esb';

import { TarificationPage }     from '@pom/PRI/tarification_tarification.page';
import { MenuPricing }          from '@pom/PRI/menu.page.js';
import { CartoucheInfo, TypeEsb } from '@commun/types';

//----------------------------------------------------------------------------------------

let page        : Page;
let menuPage    : MenuPricing;
let esb         : EsbFunctions;

let pageTarif   : TarificationPage;

const log       = new Log();
const fonction  = new TestFunctions(log);

//----------------------------------------------------------------------------------------
const sRayon          = fonction.getInitParam('rayon','Poissonnerie');
const sCodeArticle    = fonction.getInitParam('codeArticle','M11O');   
const sVilleRef       = fonction.getInitParam('villeRef','Toulouse'); 
const sNomPromo       = 'TA-PROMO_' + sCodeArticle;

const sPrixCession:string  = '8.88';
const sPrixVenteCli:string = '9.99';


test.beforeAll(async ({ browser }, testInfo) => {
    page        = await browser.newPage(); 
    esb         = new EsbFunctions(fonction);
    menuPage    = new MenuPricing(page, fonction);
    pageTarif   = new TarificationPage(page);
    const helper = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async () => {
    await fonction.close();
});

//-----------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [TARIFICATION]', async () => {  
        
        test('ListBox [RAYON] = "' + sRayon + '"', async () => {            
            await menuPage.selectRayonByName(sRayon, page);               // Sélection du rayon
            log.set('Rayon : ' + sRayon);
            log.set('| MAGASIN > ' + sVilleRef);
        });

        test('Page [TARIFICATION] - Click', async () => {
            await menuPage.click('tarification', page);
        });

        test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        });

        test('button [TARIFICATION] - Click', async () => {
            await fonction.clickAndWait(pageTarif.buttonTarification, page);
        });

        var sNomPopin:string = 'AJOUT DE TARIFICATION';
        test.describe('Popin [' + sNomPopin + ' - ' + sRayon + ']', async () => {

            test('Popin [' + sNomPopin + '] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin + ' - ' + sRayon, true);
            }); 

            test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
                await fonction.isErrorDisplayed(false, page);
            });

            test('AutoComplete [ARTICLE] = "' + sCodeArticle + '"', async () => {
                var bEnabled = await pageTarif.pInputArticle.isEnabled();
                if(bEnabled){
                    await pageTarif.pInputArticle.clear();
                    var oData = {
                        libelle         :'ARTICLE',
                        inputLocator    : pageTarif.pInputArticle,
                        inputValue      : sCodeArticle,
                        choiceSelector  :'li.gfit-autocomplete-result',
                        choicePosition  : 0,
                        typingDelay     : 100,
                        waitBefore      : 500,
                        page            : page,
                    };
                    await fonction.autoComplete(oData);
                    log.set('| Code Article > ' + sCodeArticle);
                }
            });

            test('InputField [NOM PROMO] = "' + sNomPromo + '"', async () => {
                await fonction.sendKeys(pageTarif.pPinputNomPromo, sNomPromo);
                log.set('| NOM PROMO > ' + sNomPromo);
            });

            test('ListBox [TYPE][rnd]', async () =>{
                await fonction.selectRandomListBoxOption(pageTarif.pPlistBoxTypePromo);
            });

            test('InputField [PRIX DE CESSION HT] ="' + sPrixCession + '"', async () => {
                await fonction.sendKeys(pageTarif.pPinputPrixCessionHT, sPrixCession);
            });

            test('InputField [PRIX VENTE CLIENT TTC] ="' + sPrixVenteCli + '"', async () => {
                await fonction.sendKeys(pageTarif.pPinputPVCTtc, sPrixVenteCli);
                await fonction.wait(page, 500);
            });

            test('AutoComplete [MAGASIN] = "' + sVilleRef + '"', async () => {
                var bEnabled = await pageTarif.pPinputMagasin.isEnabled();
                if(bEnabled){
                    await pageTarif.pPinputMagasin.clear();
                    var oData = {
                        libelle         :'MAGASIN',
                        inputLocator    : pageTarif.pPinputMagasin,
                        inputValue      : sVilleRef,
                        choiceSelector  :'li.gfit-autocomplete-result',
                        choicePosition  : 0,
                        typingDelay     : 100,
                        waitBefore      : 500,
                        page            : page,
                    };
                    await fonction.autoComplete(oData);
                    log.set('| MAGASIN > ' + sVilleRef);
                }
            });

            test('CheckBox [LISTE MAGASIN][ALL] - Click', async () => {
                await fonction.wait(page, 500);
                await fonction.clickElement(pageTarif.pPcheckBoxThListeMagasin);
            });

            test('Button [SAUVEGARDER] - Click', async () => {
                await fonction.clickAndWait(pageTarif.pPbuttonSauvegarder, page);
            });

            test('Popin [' + sNomPopin + '] - Is Not Visible', async () => {
                await fonction.popinVisible(page, sNomPopin + ' - ' + sRayon, false);
            });
        });
    });  //-- End Describe Page

    test.describe('Check Flux', async () => {   

        test('** CHECK FLUX **', async () =>  {

            const oFlux:TypeEsb = { 
                FLUX : [
                    {
                        NOM_FLUX    : 'EnvoyerPromotion_Mag',
                        TITRE       : 'Promotion article N°' + sCodeArticle
                    }
                ],
                                
                WAIT_BEFORE     : 30000,            // Optionnel
                VERBOSE_MOD     : false             // Optionnel car écrasé globalement
            };

            await esb.checkFlux(oFlux, page);

        });

    });

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

})